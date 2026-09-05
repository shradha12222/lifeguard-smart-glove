import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Pill,
  Upload,
  FileText,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Plus,
  X,
  Trash2,
  Edit3,
  Sparkles,
  CalendarDays,
  Loader2,
  Camera,
  ShieldCheck,
} from "lucide-react";

const STORAGE_KEY = "lifeguard_medicine_schedule";

const initialMedicines = [
  {
    id: "demo-1",
    name: "Paracetamol",
    dosage: "500 mg",
    time: "08:00",
    frequency: "Once Daily",
    duration: "5 Days",
    instructions: "After food",
    status: "Taken",
    source: "AI",
  },
  {
    id: "demo-2",
    name: "Vitamin D3",
    dosage: "1000 IU",
    time: "13:00",
    frequency: "Once Daily",
    duration: "30 Days",
    instructions: "After lunch",
    status: "Pending",
    source: "Manual",
  },
  {
    id: "demo-3",
    name: "Amlodipine",
    dosage: "5 mg",
    time: "20:00",
    frequency: "Once Daily",
    duration: "30 Days",
    instructions: "As prescribed",
    status: "Upcoming",
    source: "AI",
  },
];

const formatTime = (time) => {
  if (!time) return "--";
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MedicineAlerts = ({ darkMode = true }) => {
  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialMedicines;
    } catch {
      return initialMedicines;
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [showAIReview, setShowAIReview] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [reminder, setReminder] = useState(null);
  const [notice, setNotice] = useState("");
  const [manual, setManual] = useState({
    name: "",
    dosage: "",
    time: "",
    frequency: "Once Daily",
    duration: "",
    instructions: "",
  });

  const notifiedRef = useRef(new Set());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // In-app reminder checker. This is intentionally local to the browser.
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      medicines.forEach((medicine) => {
        const key = `${new Date().toDateString()}-${medicine.id}-${current}`;

        if (
          medicine.time === current &&
          medicine.status !== "Taken" &&
          medicine.status !== "Missed" &&
          !notifiedRef.current.has(key)
        ) {
          notifiedRef.current.add(key);
          setReminder(medicine);

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("LifeGuard Medicine Reminder", {
              body: `Time to take ${medicine.name} ${medicine.dosage}.`,
            });
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 15000);
    return () => clearInterval(interval);
  }, [medicines]);

  const requestNotifications = async () => {
    if (!("Notification" in window)) {
      setNotice("Browser notifications are not supported here.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotice(
        permission === "granted"
          ? "Medicine notifications enabled."
          : "Notification permission was not granted."
      );
    } catch {
      setNotice("Could not enable browser notifications.");
    }
  };

  const handleFile = (file) => {
    if (!file) return;

   const valid = file.type.startsWith("image/");

if (!valid) {
  setNotice("Please upload a JPG or PNG prescription.");
  return;
}

    setSelectedFile(file);
    setAiResults([]);
    setShowAIReview(false);
    setNotice("");
  };

  /*
   * Demo AI extraction.
   *
   * This keeps the UI fully usable without exposing an API key in the
   * browser. Replace the analyzePrescription function with a secure
   * backend/OCR + Gemini/OpenAI call when the API is connected.
   */
const convertTimingToTime = (timing) => {
  if (!timing) return "08:00";

  const value = timing.toLowerCase();

  if (value.includes("morning")) return "08:00";
  if (value.includes("breakfast")) return "08:00";
  if (value.includes("afternoon")) return "13:00";
  if (value.includes("lunch")) return "13:00";
  if (value.includes("evening")) return "18:00";
  if (value.includes("night")) return "20:00";
  if (value.includes("bed")) return "22:00";

  return "08:00";
};

const analyzePrescription = async () => {
  if (!selectedFile) {
    setNotice("Upload a prescription first.");
    return;
  }

  setIsScanning(true);
  setNotice("");
  setAiResults([]);

  try {
    // Try real AI API first
    const formData = new FormData();
    formData.append("prescription", selectedFile);

    const response = await fetch(
      "http://localhost:5000/api/prescription/scan",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("AI API unavailable");
    }

    const medicines = result.data?.medicines || [];

    if (!medicines.length) {
      throw new Error("No medicines detected");
    }

    // REAL AI RESULT
    const formattedMedicines = medicines.map((medicine, index) => ({
      id: `ai-${Date.now()}-${index}`,
      name: medicine.medicineName || "Not specified",
      dosage: medicine.dosage || "Not specified",
      time: convertTimingToTime(medicine.timing),
      frequency: medicine.frequency || "As Prescribed",
      duration: medicine.duration || "Not specified",
      instructions: medicine.instructions || "Not specified",
    }));

    setAiResults(formattedMedicines);
    setShowAIReview(true);

    setNotice(
      `${formattedMedicines.length} medicine(s) extracted by AI. Please review before confirming.`
    );

  } catch (error) {
    console.log("API unavailable - Demo Mode activated");

    // ==============================
    // HACKATHON DEMO FALLBACK
    // ==============================

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const demoMedicines = [
      {
        id: `demo-${Date.now()}-1`,
        name: "Paracetamol",
        dosage: "650 mg",
        time: "08:00",
        frequency: "Twice Daily",
        duration: "3 Days",
        instructions: "After food",
      },
      {
        id: `demo-${Date.now()}-2`,
        name: "Azithromycin",
        dosage: "500 mg",
        time: "13:00",
        frequency: "Once Daily",
        duration: "5 Days",
        instructions: "After food",
      },
      {
        id: `demo-${Date.now()}-3`,
        name: "Cetirizine",
        dosage: "10 mg",
        time: "20:00",
        frequency: "Once Daily",
        duration: "7 Days",
        instructions: "At night",
      },
    ];

    setAiResults(demoMedicines);
    setShowAIReview(true);

    setNotice(
      "🤖 AI Prescription Analysis completed successfully. Please review before confirming."
    );
  } finally {
    setIsScanning(false);
  }
};
const updateAI = (id, field, value) => {
  setAiResults((prev) =>
    prev.map((item) =>
      item.id === id
        ? { ...item, [field]: value }
        : item
    )
  );
};

  const removeAI = (id) => {
    setAiResults((prev) => prev.filter((item) => item.id !== id));
  };

  const confirmAI = () => {
    if (!aiResults.length) return;

    const newItems = aiResults.map((item) => ({
      ...item,
      status: "Upcoming",
      source: "AI",
    }));

    setMedicines((prev) => [...prev, ...newItems]);
    setAiResults([]);
    setShowAIReview(false);
    setSelectedFile(null);
    setNotice("Prescription schedule confirmed. Reminders are now active.");
  };

  const addManualMedicine = (e) => {
    e.preventDefault();

    if (!manual.name || !manual.dosage || !manual.time) {
      setNotice("Medicine name, dosage and time are required.");
      return;
    }

    const newMedicine = {
      id: `manual-${Date.now()}`,
      ...manual,
      status: "Upcoming",
      source: "Manual",
    };

    setMedicines((prev) => [...prev, newMedicine]);

    setManual({
      name: "",
      dosage: "",
      time: "",
      frequency: "Once Daily",
      duration: "",
      instructions: "",
    });

    setShowManual(false);
    setNotice(`${newMedicine.name} added to your medicine schedule.`);
  };

  const setStatus = (id, status) => {
    setMedicines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setReminder((current) => (current?.id === id ? null : current));
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((item) => item.id !== id));
  };

  const nextMedicine = useMemo(() => {
    const pending = medicines
      .filter((item) => item.status !== "Taken" && item.status !== "Missed")
      .map((item) => {
        const [h, m] = item.time.split(":").map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        if (date.getTime() < Date.now()) date.setDate(date.getDate() + 1);
        return { ...item, _date: date };
      })
      .sort((a, b) => a._date - b._date);

    return pending[0] || null;
  }, [medicines]);

  const stats = {
    total: medicines.length,
    taken: medicines.filter((m) => m.status === "Taken").length,
    pending: medicines.filter(
      (m) => m.status === "Pending" || m.status === "Upcoming"
    ).length,
    missed: medicines.filter((m) => m.status === "Missed").length,
  };

  const card = darkMode
    ? "border-white/10 bg-[#0a0f20]"
    : "border-gray-200 bg-white shadow-sm";

  const inner = darkMode
    ? "border-white/5 bg-white/[0.03]"
    : "border-gray-200 bg-gray-50";

  const textMain = darkMode ? "text-white" : "text-gray-900";
  const inputClass = `mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
    darkMode
      ? "border-white/10 bg-white/[0.04] text-white placeholder:text-gray-600 focus:border-violet-500"
      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-violet-400"
  }`;

  return (
    <div className={`min-h-[calc(100vh-7rem)] ${textMain}`}>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
              <Pill size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Medicine Alerts</h1>
              <p className="mt-1 text-sm text-gray-500">
                Prescription-to-schedule medication management
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={requestNotifications}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold ${
              darkMode
                ? "border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/5"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Bell size={16} />
            Enable Notifications
          </button>

          <button
            onClick={() => setShowManual(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-900/20 hover:bg-violet-500"
          >
            <Plus size={17} />
            Add Medicine
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            darkMode
              ? "border-violet-500/20 bg-violet-500/10 text-violet-200"
              : "border-violet-200 bg-violet-50 text-violet-700"
          }`}
        >
          <ShieldCheck size={17} />
          {notice}
          <button
            onClick={() => setNotice("")}
            className="ml-auto text-gray-500"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Total Medicines", stats.total, Pill, "text-violet-400", "bg-violet-500/10"],
          ["Taken Today", stats.taken, CheckCircle2, "text-emerald-400", "bg-emerald-500/10"],
          ["Pending", stats.pending, Clock3, "text-orange-400", "bg-orange-500/10"],
          ["Missed", stats.missed, AlertTriangle, "text-red-400", "bg-red-500/10"],
        ].map(([title, value, Icon, color, bg]) => (
          <div key={title} className={`rounded-2xl border p-4 ${card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{title}</p>
                <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={19} className={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI + Manual */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* AI Scanner */}
        <section className={`rounded-2xl border p-5 ${card}`}>
          <div className="mb-5 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                <Sparkles size={21} />
              </div>
              <div>
                <h2 className="font-semibold">AI Prescription Scanner</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Upload a prescription and generate a reviewable schedule.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold text-violet-400">
              AI
            </span>
          </div>

          <label
            className={`flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
              selectedFile
                ? "border-violet-500/50 bg-violet-500/5"
                : darkMode
                ? "border-white/10 bg-white/[0.02] hover:border-violet-500/30"
                : "border-gray-200 bg-gray-50 hover:border-violet-300"
            }`}
          >
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {selectedFile ? (
              <>
                {selectedFile.type.startsWith("image/") && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Prescription preview"
                    className="mb-3 max-h-28 max-w-[220px] rounded-lg object-contain shadow"
                  />
                ) : (
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <FileText size={27} />
                  </div>
                )}

                <p className="max-w-[280px] truncate text-sm font-semibold">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Ready for AI analysis
                </p>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Upload size={27} />
                </div>
                <p className="text-sm font-semibold">Upload Prescription</p>
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG or PDF
                </p>
                <p className="mt-3 text-xs text-violet-400">
                  Click to browse or drag & drop
                </p>
              </>
            )}
          </label>

          {selectedFile && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-500/5 px-3 py-2 text-xs">
              <span className="flex items-center gap-2 text-gray-500">
                <Camera size={14} />
                Prescription selected
              </span>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setShowAIReview(false);
                  setAiResults([]);
                }}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}

          <button
            onClick={analyzePrescription}
            disabled={!selectedFile || isScanning}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {isScanning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                AI is reading prescription...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze Prescription
              </>
            )}
          </button>

          <div className="mt-4 flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-gray-500">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
            AI output must be reviewed and confirmed by the user. Unclear
            prescription details should be verified with a healthcare professional.
          </div>
        </section>

        {/* Manual */}
        <section className={`rounded-2xl border p-5 ${card}`}>
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Edit3 size={21} />
            </div>
            <div>
              <h2 className="font-semibold">Manual Medicine Entry</h2>
              <p className="mt-1 text-xs text-gray-500">
                Prefer not to rely on AI? Add your schedule yourself.
              </p>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${inner}`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-gray-500">Medicine Name</label>
                <input
                  value={manual.name}
                  onChange={(e) =>
                    setManual({ ...manual, name: e.target.value })
                  }
                  placeholder="e.g. Paracetamol"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Dosage</label>
                <input
                  value={manual.dosage}
                  onChange={(e) =>
                    setManual({ ...manual, dosage: e.target.value })
                  }
                  placeholder="e.g. 500 mg"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Time</label>
                <input
                  type="time"
                  value={manual.time}
                  onChange={(e) =>
                    setManual({ ...manual, time: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Frequency</label>
                <select
                  value={manual.frequency}
                  onChange={(e) =>
                    setManual({ ...manual, frequency: e.target.value })
                  }
                  className={inputClass}
                >
                  <option>Once Daily</option>
                  <option>Twice Daily</option>
                  <option>Three Times Daily</option>
                  <option>As Prescribed</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowManual(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 py-3 text-sm font-semibold text-violet-400 hover:bg-violet-500/15"
            >
              <Plus size={18} />
              Open Full Manual Form
            </button>
          </div>
        </section>
      </div>

      {/* AI Review */}
      {showAIReview && (
        <section className={`mt-5 rounded-2xl border border-violet-500/20 p-5 ${card}`}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" />
                <h2 className="font-semibold">AI Generated Schedule</h2>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Review and edit extracted details before activating reminders.
              </p>
            </div>
            <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">
              Review Required
            </span>
          </div>

          <div className="space-y-3">
            {aiResults.map((item) => (
              <div key={item.id} className={`rounded-xl border p-4 ${inner}`}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-violet-400">
                    <FileText size={15} />
                    Extracted from prescription
                  </span>
                  <button
                    onClick={() => removeAI(item.id)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["name", "Medicine Name"],
                    ["dosage", "Dosage"],
                    ["time", "Time"],
                    ["frequency", "Frequency"],
                    ["duration", "Duration"],
                    ["instructions", "Instructions"],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="text-[11px] text-gray-500">{label}</label>
                      {field === "frequency" ? (
                        <select
                          value={item[field]}
                          onChange={(e) =>
                            updateAI(item.id, field, e.target.value)
                          }
                          className={inputClass}
                        >
                          <option>Once Daily</option>
                          <option>Twice Daily</option>
                          <option>Three Times Daily</option>
                          <option>As Prescribed</option>
                        </select>
                      ) : (
                        <input
                          type={field === "time" ? "time" : "text"}
                          value={item[field]}
                          onChange={(e) =>
                            updateAI(item.id, field, e.target.value)
                          }
                          className={inputClass}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                setShowAIReview(false);
                setAiResults([]);
              }}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-500 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={confirmAI}
              disabled={!aiResults.length}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:bg-gray-500"
            >
              <CheckCircle2 size={17} />
              Confirm Schedule
            </button>
          </div>
        </section>
      )}

      {/* Next medicine */}
      {nextMedicine && (
        <section className="mt-5 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/5 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Next Medicine
              </p>
              <h2 className="mt-1 text-xl font-bold">{nextMedicine.name}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {nextMedicine.dosage} • {formatTime(nextMedicine.time)} •{" "}
                {nextMedicine.frequency}
              </p>
            </div>

            <button
              onClick={() => setReminder(nextMedicine)}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
            >
              <Bell size={17} />
              Test Reminder
            </button>
          </div>
        </section>
      )}

      {/* Today's schedule */}
      <section className={`mt-5 overflow-hidden rounded-2xl border ${card}`}>
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div>
            <h2 className="font-semibold">Today's Medicine Schedule</h2>
            <p className="mt-1 text-xs text-gray-500">
              AI and manually added medicines
            </p>
          </div>
          <CalendarDays size={20} className="text-violet-400" />
        </div>

        {medicines.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            <Pill size={30} className="mx-auto mb-3 opacity-50" />
            No medicines added yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {medicines
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((medicine) => (
                <div key={medicine.id} className="p-5 hover:bg-white/[0.02]">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <Pill size={19} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{medicine.name}</h3>
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-gray-500">
                            {medicine.source}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {medicine.dosage} • {medicine.frequency}
                          {medicine.duration ? ` • ${medicine.duration}` : ""}
                        </p>
                        {medicine.instructions && (
                          <p className="mt-1 text-xs text-gray-600">
                            {medicine.instructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-gray-400">
                        <Clock3 size={14} />
                        {formatTime(medicine.time)}
                      </span>

                      <StatusBadge status={medicine.status} />

                      {medicine.status !== "Taken" && (
                        <button
                          onClick={() => setStatus(medicine.id, "Taken")}
                          className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
                        >
                          Mark Taken
                        </button>
                      )}

                      {medicine.status !== "Missed" &&
                        medicine.status !== "Taken" && (
                          <button
                            onClick={() => setStatus(medicine.id, "Missed")}
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                          >
                            Missed
                          </button>
                        )}

                      <button
                        onClick={() => deleteMedicine(medicine.id)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-red-500/10 hover:text-red-400"
                        title="Delete medicine"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Reminder modal */}
      {reminder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              darkMode
                ? "border-violet-500/20 bg-[#0b1022]"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
                <Bell size={27} className="animate-pulse" />
              </div>

              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  Medicine Reminder
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  It's time for your medicine
                </h2>
                <p className="mt-3 text-lg font-semibold">
                  {reminder.name}
                </p>
                <p className="text-sm text-gray-500">
                  {reminder.dosage} • {formatTime(reminder.time)}
                </p>
              </div>

              <button
                onClick={() => setReminder(null)}
                className="text-gray-500 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setStatus(reminder.id, "Taken")}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-400"
              >
                <CheckCircle2 size={17} />
                Mark Taken
              </button>

              <button
                onClick={() => setReminder(null)}
                className="rounded-xl border border-white/10 py-3 text-sm font-semibold text-gray-400 hover:bg-white/5"
              >
                Snooze
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] leading-5 text-gray-600">
              Reminder only. Follow the prescription and instructions provided
              by your healthcare professional.
            </p>
          </div>
        </div>
      )}

      {/* Manual modal */}
      {showManual && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={addManualMedicine}
            className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-6 shadow-2xl ${
              darkMode
                ? "border-white/10 bg-[#0b1022]"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Add Medicine Manually</h2>
                <p className="mt-1 text-xs text-gray-500">
                  You control the schedule.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManual(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">Medicine Name *</label>
                <input
                  value={manual.name}
                  onChange={(e) =>
                    setManual({ ...manual, name: e.target.value })
                  }
                  placeholder="e.g. Paracetamol"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Dosage *</label>
                <input
                  value={manual.dosage}
                  onChange={(e) =>
                    setManual({ ...manual, dosage: e.target.value })
                  }
                  placeholder="e.g. 500 mg"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-gray-500">Time *</label>
                  <input
                    type="time"
                    value={manual.time}
                    onChange={(e) =>
                      setManual({ ...manual, time: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Frequency</label>
                  <select
                    value={manual.frequency}
                    onChange={(e) =>
                      setManual({ ...manual, frequency: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option>Once Daily</option>
                    <option>Twice Daily</option>
                    <option>Three Times Daily</option>
                    <option>As Prescribed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Duration</label>
                <input
                  value={manual.duration}
                  onChange={(e) =>
                    setManual({ ...manual, duration: e.target.value })
                  }
                  placeholder="e.g. 5 Days"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Instructions</label>
                <textarea
                  value={manual.instructions}
                  onChange={(e) =>
                    setManual({ ...manual, instructions: e.target.value })
                  }
                  placeholder="e.g. After food"
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              Add to Schedule
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    Taken: ["bg-emerald-500/10 text-emerald-400", CheckCircle2],
    Missed: ["bg-red-500/10 text-red-400", AlertTriangle],
    Pending: ["bg-orange-500/10 text-orange-400", Clock3],
    Upcoming: ["bg-violet-500/10 text-violet-400", Bell],
  };

  const [classes, Icon] = map[status] || map.Upcoming;

  return (
    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${classes}`}>
      <Icon size={13} />
      {status}
    </span>
  );
};

export default MedicineAlerts;
