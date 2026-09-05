const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Groq = require("groq-sdk");
const connectDB = require("./db");
const HealthRecord = require("./models/HealthRecord");
const multer = require("multer");
require("dotenv").config();

const app = express();

// ==========================================
// Groq AI
// ==========================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// Port
// ==========================================

const PORT = 5000;

// ==========================================
// Blynk
// ==========================================

const BLYNK_URL = "https://blynk.cloud";
const BLYNK_TOKEN = process.env.BLYNK_TOKEN;

// ==========================================
// MongoDB Connection
// ==========================================

connectDB();

// ==========================================
// Emergency Detection
// ==========================================

const checkEmergency = (blynkData) => {
  const bpm = Number(blynkData.v3);
  const temperature = Number(blynkData.v4);
  const gesture = String(blynkData.v5 || "");

  let emergency = false;
  let emergencyReason = [];

  // Heart Rate
  if (!Number.isNaN(bpm) && (bpm < 50 || bpm > 120)) {
    emergency = true;
    emergencyReason.push("Abnormal heart rate");
  }

  // Temperature
  if (
    !Number.isNaN(temperature) &&
    (temperature < 35 || temperature > 38.5)
  ) {
    emergency = true;
    emergencyReason.push("Abnormal temperature");
  }

  // Emergency Gesture
  if (
    gesture.toLowerCase().includes("help") ||
    gesture.toLowerCase().includes("emergency")
  ) {
    emergency = true;
    emergencyReason.push("Emergency gesture detected");
  }

  return {
    emergency,
    emergencyReason,
  };
};

// ==========================================
// Test Backend
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LifeGuard Backend is running",
  });
});

// ==========================================
// GROQ AI CHAT
// ==========================================

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

const completion = await groq.chat.completions.create({ 
  model: "llama-3.3-70b-versatile",

  max_completion_tokens: 500,

      messages: [
        {
          role: "system",

          content: `
You are LifeGuard AI, the intelligent assistant of the LifeGuard Smart Glove.

LifeGuard Smart Glove is an IoT-based health and safety system that can monitor:
- Heart rate / BPM
- Body temperature
- Hand gestures
- Emergency situations

Your responsibilities:

1. Answer questions about LifeGuard Smart Glove.
2. Explain BPM in simple language.
3. Explain temperature readings.
4. Explain emergency alerts.
5. Explain gesture-based emergency detection.
6. Help users understand their health dashboard.
7. Give general health and safety information.
8. Answer normal health-related questions in a simple and friendly way.
9. Keep answers concise and easy to understand.
10. If the user asks about the device, explain it clearly.

Important medical safety rules:
- You are an AI assistant, not a doctor.
- Do not diagnose diseases.
- Do not claim certainty about medical conditions.
- For serious or emergency symptoms, advise the user to seek professional medical help immediately.

If the question is unrelated to LifeGuard or health, politely answer if possible and guide the user back to the LifeGuard assistant.

Use simple language suitable for patients, caregivers and elderly users.
          `,
        },

        {
          role: "user",
          content: message.trim(),
        },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Groq AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI response failed",
      error: error.message,
    });
  }
});

// ==========================================
// GET LIVE DATA FROM BLYNK
// ==========================================

app.get("/api/blynk/live", async (req, res) => {
  try {
    const response = await axios.get(
      `${BLYNK_URL}/external/api/getAll`,
      {
        params: {
          token: BLYNK_TOKEN,
        },
      }
    );

    const blynkData = response.data;

    const healthData = {
      bpm: Number(blynkData.v3),
      temperature: Number(blynkData.v4),
      gesture: blynkData.v5 || "Unknown",
    };

    const emergencyStatus = checkEmergency(blynkData);

    res.json({
      success: true,
      data: healthData,
      emergency: emergencyStatus.emergency,
      emergencyReason: emergencyStatus.emergencyReason,
    });
  } catch (error) {
    console.error(
      "Blynk Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch Blynk data",
    });
  }
});

// ==========================================
// SAVE HEALTH DATA
// ==========================================

app.post("/api/health/save", async (req, res) => {
  try {
    const {
      bpm,
      temperature,
      gesture,
    } = req.body;

    const record = await HealthRecord.create({
      patientId: "LG-001",
      bpm: Number(bpm),
      temperature: Number(temperature),
      gesture: gesture || "Unknown",
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Health data saved successfully",
      record,
    });
  } catch (error) {
    console.error(
      "MongoDB Save Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to save health data",
    });
  }
});

// ==========================================
// GET PATIENT HISTORY
// ==========================================

app.get(
  "/api/health/history/:patientId",
  async (req, res) => {
    try {
      const records = await HealthRecord
        .find({
          patientId: req.params.patientId,
        })
        .sort({
          timestamp: -1,
        })
        .limit(1000);

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error(
        "History Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch patient history",
      });
    }
  }
);

// ==========================================
// AUTOMATICALLY SAVE BLYNK DATA
// ==========================================

const saveBlynkData = async () => {
  try {
    const response = await axios.get(
      `${BLYNK_URL}/external/api/getAll`,
      {
        params: {
          token: BLYNK_TOKEN,
        },
      }
    );

    const blynkData = response.data;

    const emergencyStatus =
      checkEmergency(blynkData);

    const healthData = {
      patientId: "LG-001",

      bpm: Number(blynkData.v3),

      temperature: Number(blynkData.v4),

      gesture: blynkData.v5 || "Unknown",

      timestamp: new Date(),

      emergency: emergencyStatus.emergency,

      emergencyReason:
        emergencyStatus.emergencyReason,
    };

    await HealthRecord.create(healthData);

    console.log(
      "Health data saved:",
      healthData
    );

    if (emergencyStatus.emergency) {
      console.log(
        "🚨 EMERGENCY DETECTED 🚨"
      );

      console.log(
        "Reason:",
        emergencyStatus.emergencyReason.join(", ")
      );
    }
  } catch (error) {
    console.error(
      "Automatic MongoDB Save Error:",
      error.response?.data || error.message
    );
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
// ==========================================
// AI PRESCRIPTION SCANNER
// ==========================================

app.post(
  "/api/prescription/scan",
  upload.single("prescription"),
  async (req, res) => {
    try {
      console.log("=================================");
      console.log("📄 Prescription scan request received");

      // Check file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No prescription image uploaded",
        });
      }

      console.log("File:", req.file.originalname);
      console.log("Type:", req.file.mimetype);
      console.log("Size:", req.file.size);

      // Only images
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Please upload a JPG, PNG or WEBP image",
        });
      }

      // Convert image to Base64
      const base64Image =
        req.file.buffer.toString("base64");

      const imageData =
        `data:${req.file.mimetype};base64,${base64Image}`;

      console.log("🤖 Sending prescription to Groq...");
      console.log("Model: qwen/qwen3.6-27b");

      const completion =
        await groq.chat.completions.create({
          // ✅ UPDATED GROQ VISION MODEL
          model: "qwen/qwen3.6-27b",

          messages: [
            {
              role: "system",

              content: `
You are LifeGuard Prescription AI.

Read the prescription image and extract ONLY
the medicines that are clearly visible.

For every medicine extract:

- medicineName
- dosage
- frequency
- timing
- duration
- instructions

Rules:

1. Do not diagnose.
2. Do not recommend medicines.
3. Do not change dosage.
4. Do not guess missing information.
5. If something is not visible or unclear,
   write "Not specified".
6. Extract ONLY information visible in the image.

Return ONLY valid JSON.

Required format:

{
  "medicines": [
    {
      "medicineName": "",
      "dosage": "",
      "frequency": "",
      "timing": "",
      "duration": "",
      "instructions": ""
    }
  ]
}
`,
            },

            {
              role: "user",

              content: [
                {
                  type: "text",

                  text:
                    "Extract all clearly visible medicines from this prescription.",
                },

                {
                  type: "image_url",

                  image_url: {
                    url: imageData,
                  },
                },
              ],
            },
          ],

          temperature: 0,

          max_completion_tokens: 2048,

          // Force JSON response
          response_format: {
            type: "json_object",
          },
        });

      // Get AI response
      const aiResponse =
        completion.choices?.[0]?.message?.content;

      console.log("🤖 Groq Response:");
      console.log(aiResponse);

      if (!aiResponse) {
        throw new Error(
          "Groq returned an empty response"
        );
      }

      // Clean markdown if required
      const cleanedResponse =
        aiResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      let prescriptionData;

      try {
        prescriptionData =
          JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error(
          "❌ JSON Parse Error:",
          parseError.message
        );

        return res.status(500).json({
          success: false,
          message:
            "AI returned invalid prescription JSON",
        });
      }

      console.log(
        "✅ Prescription extracted successfully"
      );

      console.log(
        "Medicines:",
        prescriptionData.medicines
      );

      return res.json({
        success: true,
        data: prescriptionData,
      });

    } catch (error) {

      console.error("=================================");
      console.error("❌ PRESCRIPTION AI ERROR");
      console.error("Message:", error.message);
      console.error("Status:", error.status);
      console.error("Error:", error.error);

      console.error(
        "Response:",
        error.response?.data
      );

      console.error("=================================");

      return res.status(error.status || 500).json({
        success: false,

        message:
          error.response?.data?.error?.message ||
          error.message ||
          "Failed to analyze prescription",
      });
    }
  }
);

// ==========================================
// Save Every 10 Seconds
// ==========================================

setInterval(
  saveBlynkData,
  10000
);

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `LifeGuard Backend running at http://localhost:${PORT}`
  );
});