import React, { useState } from "react";

function AIChatbot() {
  const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I'm LifeGuard AI. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              "Sorry, I couldn't process your question.",
          },
        ]);
      }
} catch (error) {
  console.error("AI Error:", error);

  const lower = userMessage.toLowerCase();

  let reply =
    "🤖 I'm currently in Demo Mode. I can help you with medicines, BPM, temperature and basic health tracking.";

  if (lower.includes("bpm") || lower.includes("heart")) {
    reply =
      "❤️ Normal resting heart rate is generally around 60–100 BPM. Please monitor unusual or persistent readings.";
  } 
  else if (lower.includes("medicine") || lower.includes("tablet")) {
    reply =
      "💊 Your medicine reminder is active. Please take medicines according to the prescribed schedule.";
  } 
  else if (lower.includes("temperature") || lower.includes("fever")) {
    reply =
      "🌡️ Normal body temperature is approximately 36.5–37.5°C. If you have a persistent fever, consult a doctor.";
  } 
  else if (lower.includes("spo2") || lower.includes("oxygen")) {
    reply =
      "🫁 SpO₂ is used to monitor blood oxygen level. If readings are consistently low, medical attention may be required.";
  } 
  else if (lower.includes("health")) {
    reply =
      "🏥 LifeGuard helps you track medicines and basic health parameters such as BPM, SpO₂ and temperature.";
  }

  setMessages((prev) => [
    ...prev,
    {
      sender: "bot",
      text: reply,
    },
  ]);
}

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          right: "25px",
          bottom: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "25px",
          cursor: "pointer",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.25)",
          zIndex: 9999,
        }}
      >
        🤖
      </button>

      {/* Chat Window */}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "25px",
            bottom: "95px",
            width: "350px",
            height: "500px",
            background: "white",
            borderRadius: "18px",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >

          {/* Header */}

          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "16px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>🤖 LifeGuard AI</span>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}

          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              background: "#f8fafc",
            }}
          >

            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "10px",
                }}
              >

                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 13px",
                    borderRadius: "12px",

                    background:
                      message.sender === "user"
                        ? "#2563eb"
                        : "#e5e7eb",

                    color:
                      message.sender === "user"
                        ? "white"
                        : "#111827",

                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.text}
                </div>

              </div>
            ))}

            {loading && (
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                LifeGuard AI is thinking...
              </div>
            )}

          </div>

          {/* Input */}

          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              background: "white",
            }}
          >

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask LifeGuard AI..."
              style={{
                flex: 1,
                padding: "10px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "10px",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                marginLeft: "8px",
                padding: "10px 14px",
                border: "none",
                borderRadius: "10px",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIChatbot;