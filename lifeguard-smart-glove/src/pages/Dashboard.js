import React, { useEffect, useState, useMemo, useRef } from "react";
import BotpressChat from "../components/BotpressChat";
import MedicineAlerts from "../pages/MedicineAlerts";
import AIChatbot from "../components/AIChatbot";
import FutureHealthPrediction from "../components/FutureHealthPrediction";
import {
  getLiveHealthData,
  getPatientHistory,
} from "../services/api";

import {
  Activity,
  Bell,
  Brain,
  Sun,
  Moon,
  ChevronDown,
  Clock3,
  HeartPulse,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  ShieldCheck,
  Thermometer,
  UserRound,
  Hand,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  Stethoscope,
  CalendarDays,
  TrendingUp,
  Watch,
  Pill,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [emergencyAlertShown, setEmergencyAlertShown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioContextRef = useRef(null);
  const previousEmergencyRef = useRef(false);
  const previousBpmRef = useRef(null);

  // DAY / NIGHT MODE
  const [darkMode, setDarkMode] = useState(true);

  // SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  // LIVE DATA
  const [bpm, setBpm] = useState("--");
  const [temperature, setTemperature] = useState("--");
  const [gesture, setGesture] = useState("--");
  const [connected, setConnected] = useState(false);

  // HISTORY
  const [history, setHistory] = useState([]);

  // ==========================================
  // THEME
  // ==========================================

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // ==========================================
  // FETCH LIVE BLYNK DATA
  // ==========================================

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const result = await getLiveHealthData();

        if (result.success) {
          setBpm(result.data.bpm);
          setTemperature(result.data.temperature);
          setGesture(result.data.gesture);
          setConnected(true);
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.error("Health data error:", error);
        setConnected(false);
      }
    };

    fetchHealthData();

    const interval = setInterval(fetchHealthData, 2000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // FETCH MONGODB HISTORY
  // ==========================================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getPatientHistory();

        if (response.success) {
          setHistory(response.data || []);
        }
      } catch (error) {
        console.error("History fetch error:", error);
      }
    };

    fetchHistory();

    const interval = setInterval(fetchHistory, 10000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  // ==========================================
  // NUMERIC VALUES
  // ==========================================

  const numericBpm = Number(bpm);
  const numericTemperature = Number(temperature);
  
  // ==========================================
// CRITICAL BPM
// ==========================================
  const bpmEmergency =
  Number.isFinite(numericBpm) &&
  numericBpm > 0 &&
  (numericBpm < 50 || numericBpm > 120);

  // ==========================================
  // VITAL STATUS
  // ==========================================

  const bpmValid =
    Number.isFinite(numericBpm) && numericBpm > 0;

  const temperatureValid =
    Number.isFinite(numericTemperature) &&
    numericTemperature > 0;

  const bpmNormal =
    !bpmValid ||
    (numericBpm >= 60 && numericBpm <= 100);

  const temperatureNormal =
    !temperatureValid ||
    (numericTemperature >= 36 &&
      numericTemperature <= 37.5);

 // ==========================================
// EMERGENCY DETECTION
// ==========================================

const emergencyData = useMemo(() => {
  const reasons = [];

  const bpmValue = Number(bpm);
  const temperatureValue = Number(temperature);

  const validBpm =
    Number.isFinite(bpmValue) && bpmValue > 0;

  const validTemperature =
    Number.isFinite(temperatureValue) &&
    temperatureValue > 0;

  // 🚨 BPM EMERGENCY
  const bpmEmergency =
    validBpm &&
    (bpmValue < 50 || bpmValue > 120);

  // 🚨 TEMPERATURE EMERGENCY
  const temperatureEmergency =
    validTemperature &&
    temperatureValue > 38.5;

  // 🚨 GESTURE EMERGENCY
  const gestureText = String(gesture || "")
    .trim()
    .toLowerCase();

  const isEmergencyGesture =
    gestureText === "help" ||
    gestureText === "emergency";

  if (bpmEmergency) {
    reasons.push(
      bpmValue < 50
        ? "Heart rate is critically low"
        : "Heart rate is critically high"
    );
  }

  if (temperatureEmergency) {
    reasons.push("Abnormal temperature");
  }

  if (isEmergencyGesture) {
    reasons.push("Emergency gesture detected");
  }

  return {
    emergency: reasons.length > 0,
    emergencyReason: reasons,
    emergencyGesture: isEmergencyGesture,
  };
}, [bpm, temperature, gesture]);

const {
  emergency,
  emergencyReason,
  emergencyGesture,
} = emergencyData;


// ==========================================
// 🚨 EMERGENCY POPUP / PROMPT
// ==========================================

useEffect(() => {

  // No emergency → reset state
  if (!emergency) {
    previousEmergencyRef.current = false;
    setEmergencyAlertShown(false);
    return;
  }

  // Emergency already shown for current emergency
  if (previousEmergencyRef.current) {
    return;
  }

  console.log("🚨🚨 EMERGENCY DETECTED 🚨🚨");
  console.log("Reason:", emergencyReason);

  const message = `
🚨🚨 EMERGENCY ALERT 🚨🚨

IMMEDIATE ATTENTION REQUIRED!

${emergencyReason
    .map((reason) => `⚠ ${reason}`)
    .join("\n")}

━━━━━━━━━━━━━━━━━━━━
❤️ BPM: ${bpm}
🌡 Temperature: ${temperature}°C
✋ Gesture: ${gesture}
━━━━━━━━━━━━━━━━━━━━

LifeGuard Smart Glove has detected
a potentially critical condition.

Please take immediate action.
`;

  // 🔥 SHOW BROWSER PROMPT
  setTimeout(() => {
    alert(message);
  }, 100);

  // Mark popup as already shown
  previousEmergencyRef.current = true;
  setEmergencyAlertShown(true);

  // 🔊 Play emergency sound if enabled
  if (soundEnabled) {
    playEmergencySound();
  }

}, [
  emergency,
  emergencyReason,
  bpm,
  temperature,
  gesture,
  soundEnabled,
]);

  // ==========================================
  // EMERGENCY SOUND
  // ==========================================

  const enableEmergencySound = async () => {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) {
      alert(
        "Your browser does not support emergency sound."
      );
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext();
      }

      if (
        audioContextRef.current.state ===
        "suspended"
      ) {
        await audioContextRef.current.resume();
      }

      setSoundEnabled(true);

      const audioCtx =
        audioContextRef.current;

      const oscillator =
        audioCtx.createOscillator();

      const gainNode =
        audioCtx.createGain();

      oscillator.type = "square";

      oscillator.frequency.setValueAtTime(
        800,
        audioCtx.currentTime
      );

      gainNode.gain.setValueAtTime(
        0.2,
        audioCtx.currentTime
      );

      oscillator.connect(gainNode);
      gainNode.connect(
        audioCtx.destination
      );

      oscillator.start();

      oscillator.stop(
        audioCtx.currentTime + 0.3
      );
    } catch (error) {
      console.error(
        "Audio enable error:",
        error
      );
    }
  };

  const playEmergencySound = async () => {
    if (!soundEnabled) {
      console.log(
        "Emergency sound is disabled"
      );
      return;
    }

    const audioCtx =
      audioContextRef.current;

    if (!audioCtx) {
      console.log(
        "Audio context not initialized"
      );
      return;
    }

    try {
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      const oscillator =
        audioCtx.createOscillator();

      const gainNode =
        audioCtx.createGain();

      oscillator.type = "square";

      oscillator.frequency.setValueAtTime(
        900,
        now
      );

      oscillator.frequency.setValueAtTime(
        600,
        now + 0.25
      );

      oscillator.frequency.setValueAtTime(
        900,
        now + 0.5
      );

      gainNode.gain.setValueAtTime(
        0.3,
        now
      );

      gainNode.gain.setValueAtTime(
        0.3,
        now + 0.6
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.8
      );

      oscillator.connect(gainNode);
      gainNode.connect(
        audioCtx.destination
      );

      oscillator.start(now);
      oscillator.stop(now + 0.8);

      console.log(
        "🚨 Emergency sound played"
      );
    } catch (error) {
      console.error(
        "Emergency sound error:",
        error
      );
    }
  };
  
  // ==========================================
  // VITAL CARDS
  // ==========================================

  const vitals = [
    {
      title: "Heart Rate",
      value: bpm,
      unit: "BPM",
      status: bpmNormal ? "Normal" : "Check",
      icon: HeartPulse,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
    },
    {
      title: "Temperature",
      value: temperature,
      unit: "°C",
      status: temperatureNormal
        ? "Normal"
        : "Check",
      icon: Thermometer,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
    },
    {
      title: "Gesture",
      value: gesture,
      unit: "",
      status:
        gesture !== "--"
          ? "Detected"
          : "Waiting",
      icon: Hand,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
  ];

  // ==========================================
  // 7-DAY HISTORY
  // ==========================================

  const sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 7
  );

  const sevenDayHistory = history.filter(
    (record) => {
      if (!record.timestamp) return false;

      const recordDate = new Date(
        record.timestamp
      );

      return recordDate >= sevenDaysAgo;
    }
  );

  // ==========================================
  // HISTORY STATISTICS
  // ==========================================

  const bpmValues = sevenDayHistory
    .map((record) => Number(record.bpm))
    .filter(
      (value) => !Number.isNaN(value)
    );

  const temperatureValues =
    sevenDayHistory
      .map((record) =>
        Number(record.temperature)
      )
      .filter(
        (value) => !Number.isNaN(value)
      );

  const averageBpm =
    bpmValues.length > 0
      ? (
          bpmValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / bpmValues.length
        ).toFixed(1)
      : "--";

  const averageTemperature =
    temperatureValues.length > 0
      ? (
          temperatureValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          temperatureValues.length
        ).toFixed(1)
      : "--";

  const maximumBpm =
    bpmValues.length > 0
      ? Math.max(...bpmValues)
      : "--";

  const minimumBpm =
    bpmValues.length > 0
      ? Math.min(...bpmValues)
      : "--";

  // ==========================================
  // AI HEALTH STATUS
  // ==========================================

  let aiStatus = "Stable";

  let aiMessage =
    "Current health parameters are within the expected monitoring range.";

  if (emergency) {
    aiStatus = "Emergency";

    aiMessage =
      "Emergency condition detected. Immediate attention may be required.";
  } else if (
    !bpmNormal ||
    !temperatureNormal
  ) {
    aiStatus = "Attention";

    aiMessage =
      "One or more health parameters require attention and continued monitoring.";
  } else if (
    sevenDayHistory.length === 0
  ) {
    aiStatus = "Monitoring";

    aiMessage =
      "Collecting patient history for deeper 7-day health analysis.";
  }

  <FutureHealthPrediction
  bpm={bpm}
  temperature={temperature}
  history={sevenDayHistory}
  darkMode={darkMode}
/>
  // ==========================================
  // COMMON THEME CLASSES
  // ==========================================

  const cardClass = `
    rounded-2xl border p-5 transition-colors duration-300
    ${
      darkMode
        ? "border-white/10 bg-[#0a0f20]"
        : "border-gray-200 bg-white shadow-sm"
    }
  `;

  const innerClass = `
    rounded-xl border p-4 transition-colors duration-300
    ${
      darkMode
        ? "border-white/5 bg-white/[0.02]"
        : "border-gray-200 bg-gray-50"
    }
  `;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#050816] text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >

{/* ================= EMERGENCY POPUP ================= */}

{emergency && (
  <div className="fixed inset-0 z-[100] pointer-events-none">

    {/* Red emergency overlay */}
    <div className="absolute inset-0 bg-red-500/5 animate-pulse" />

    {/* Emergency popup */}
    <div
      className="
        pointer-events-auto
        fixed right-6 top-24
        z-[101]
        w-[380px]
        rounded-2xl
        border-2 border-red-500
        bg-[#18080b]
        p-5
        shadow-2xl shadow-red-900/60
        animate-pulse
      "
    >

      {/* Header */}
      <div className="flex items-start gap-4">

        <div
          className="
            flex h-14 w-14 shrink-0
            items-center justify-center
            rounded-xl
            bg-red-500/20
            text-red-400
            animate-pulse
          "
        >
          <AlertTriangle size={30} />
        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-bold text-red-400">
              🚨 EMERGENCY
            </h3>

            <span
              className="
                h-3 w-3 rounded-full
                bg-red-500
                animate-ping
              "
            />

          </div>

          <p className="mt-1 text-xs text-gray-400">
            LifeGuard Smart Glove detected an abnormal condition.
          </p>

        </div>

      </div>

      {/* Emergency Reason */}
      <div
        className="
          mt-4 rounded-xl
          border border-red-500/30
          bg-red-500/10
          p-4
        "
      >

        <p className="text-xs font-bold uppercase tracking-wider text-red-300">
          Emergency Reason
        </p>

        <ul className="mt-2 space-y-2">

          {emergencyReason.map((reason, index) => (
            <li
              key={index}
              className="
                flex items-center gap-2
                text-sm font-semibold
                text-red-200
              "
            >
              <span className="text-red-400">
                ⚠
              </span>

              {reason}
            </li>
          ))}

        </ul>

      </div>

      {/* Vitals */}
      <div className="mt-3 grid grid-cols-2 gap-3">

        {/* BPM */}
        <div
          className={`
            rounded-xl
            border
            p-3
            ${
              Number(bpm) < 50 || Number(bpm) > 120
                ? "border-red-500/40 bg-red-500/20 animate-pulse"
                : "border-white/10 bg-white/5"
            }
          `}
        >

          <p className="text-[10px] font-semibold text-gray-500">
            HEART RATE
          </p>

          <p className="mt-1 text-xl font-bold text-red-300">
            {bpm}
            <span className="ml-1 text-xs">
              BPM
            </span>
          </p>

          {(Number(bpm) < 50 || Number(bpm) > 120) && (
            <p className="mt-1 text-[10px] font-bold text-red-400">
              ⚠ CRITICAL
            </p>
          )}

        </div>

        {/* Temperature */}
        <div
          className={`
            rounded-xl
            border
            p-3
            ${
              Number(temperature) > 38.5
                ? "border-red-500/40 bg-red-500/20 animate-pulse"
                : "border-white/10 bg-white/5"
            }
          `}
        >

          <p className="text-[10px] font-semibold text-gray-500">
            TEMPERATURE
          </p>

          <p className="mt-1 text-xl font-bold text-orange-300">
            {temperature}
            <span className="ml-1 text-xs">
              °C
            </span>
          </p>

          {Number(temperature) > 38.5 && (
            <p className="mt-1 text-[10px] font-bold text-red-400">
              ⚠ CRITICAL
            </p>
          )}

        </div>

      </div>

      {/* Gesture */}
      {emergencyGesture && (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">

          <p className="text-xs font-semibold text-red-300">
            ✋ Emergency Gesture
          </p>

          <p className="mt-1 text-sm font-bold text-red-200">
            {gesture}
          </p>

        </div>
      )}

      {/* Send Alert */}
      <button
        onClick={() => {
          alert(
            `🚨 EMERGENCY ALERT SENT!\n\nReasons:\n${emergencyReason.join(
              "\n"
            )}\n\nBPM: ${bpm}\nTemperature: ${temperature}°C\nGesture: ${gesture}`
          );
        }}
        className="
          mt-4 w-full
          rounded-xl
          bg-red-500
          py-3
          text-sm
          font-bold
          text-white
          transition
          hover:bg-red-400
        "
      >
        🚨 Send Emergency Alert
      </button>

    </div>

  </div>
)}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen border-r transition-all duration-300 ${
          darkMode
            ? "border-white/10 bg-[#080b1a] text-white"
            : "border-gray-200 bg-white text-gray-900 shadow-sm"
        } ${
          sidebarOpen
            ? "w-64"
            : "w-20"
        }`}
      >

        {/* LOGO */}

        <div
          className={`flex h-20 items-center border-b px-5 ${
            darkMode
              ? "border-white/10"
              : "border-gray-200"
          }`}
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-purple-500/20">
            <HeartPulse size={24} />
          </div>

          {sidebarOpen && (
            <div className="ml-3">

              <h1 className="text-lg font-bold">
                LifeGuard
              </h1>

              <p className="text-[10px] font-semibold tracking-[3px] text-violet-500">
                SMART HEALTHCARE
              </p>

            </div>
          )}

        </div>

        {/* NAVIGATION */}

        <nav className="mt-6 px-3">

          <SidebarItem
            icon={<Home size={19} />}
            text="Dashboard"
            active={activePage === "dashboard"}
            open={sidebarOpen}
            darkMode={darkMode}
            onClick={() => setActivePage("dashboard")}
          />

          <SidebarItem
            icon={<Pill size={19} />}
            text="Medicine Alerts"
            active={activePage === "medicine"}
            open={sidebarOpen}
            darkMode={darkMode}
            onClick={() => setActivePage("medicine")}
          />

          <SidebarItem
            icon={<Activity size={19} />}
            text="Live Monitoring"
            open={sidebarOpen}
            darkMode={darkMode}
          />

          <SidebarItem
            icon={<TrendingUp size={19} />}
            text="Health Analytics"
            open={sidebarOpen}
            darkMode={darkMode}
          />

          <SidebarItem
            icon={<Hand size={19} />}
            text="Gesture Detection"
            open={sidebarOpen}
            darkMode={darkMode}
          />

          <SidebarItem
            icon={<AlertTriangle size={19} />}
            text="Emergency Alerts"
            open={sidebarOpen}
            darkMode={darkMode}
          />

          <SidebarItem
            icon={<Brain size={19} />}
            text="AI Health Assistant"
            open={sidebarOpen}
            darkMode={darkMode}
          />

          <SidebarItem
            icon={<CalendarDays size={19} />}
            text="Appointments"
            open={sidebarOpen}
            darkMode={darkMode}
          />

          <div
            className={`my-5 border-t ${
              darkMode
                ? "border-white/10"
                : "border-gray-200"
            }`}
          />

          <SidebarItem
            icon={<UserRound size={19} />}
            text="Patient Profile"
            open={sidebarOpen}
            darkMode={darkMode}
          />

          <SidebarItem
            icon={<Settings size={19} />}
            text="Settings"
            open={sidebarOpen}
            darkMode={darkMode}
          />

        </nav>

        {/* BOTTOM USER */}

        <div className="absolute bottom-4 left-3 right-3">

          <div
            className={`rounded-xl border p-3 ${
              darkMode
                ? "border-white/10 bg-white/[0.03]"
                : "border-gray-200 bg-gray-50"
            } ${
              sidebarOpen
                ? ""
                : "flex justify-center"
            }`}
          >

            <div className="flex items-center">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-violet-500">
                <UserRound size={18} />
              </div>

              {sidebarOpen && (
                <>
                  <div className="ml-3 flex-1">

                    <p className="text-sm font-medium">
                      Patient
                    </p>

                    <p className="text-xs text-gray-500">
                      Active profile
                    </p>

                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-gray-500 transition hover:text-red-400"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              )}

            </div>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main
        className={`transition-all duration-300 ${
          sidebarOpen
            ? "ml-64"
            : "ml-20"
        }`}
      >

        {/* ================= TOPBAR ================= */}

        <header
          className={`sticky top-0 z-40 flex h-20 items-center justify-between border-b px-6 backdrop-blur-xl transition-colors duration-300 ${
            darkMode
              ? "border-white/10 bg-[#050816]/90"
              : "border-gray-200 bg-white/90"
          }`}
        >

          <div className="flex items-center gap-4">

            {/* DAY / NIGHT TOGGLE */}

            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                  : "border-orange-400/30 bg-orange-400/10 text-orange-500"
              }`}
              title={
                darkMode
                  ? "Day Mode"
                  : "Night Mode"
              }
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* SIDEBAR MENU */}

            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className={`rounded-lg p-2 transition ${
                darkMode
                  ? "text-gray-400 hover:bg-white/5 hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Menu size={21} />
            </button>

            <div>

              <h2 className="text-xl font-semibold">
                {activePage === "medicine"
                  ? "Medicine Alerts"
                  : "Health Dashboard"}
              </h2>

              <p className="text-xs text-gray-500">
                {activePage === "medicine"
                  ? "Prescription & medication management"
                  : "Real-time patient monitoring"}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            {/* CONNECTION */}

            <div
              className={`hidden items-center gap-2 rounded-full border px-4 py-2 sm:flex ${
                darkMode
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >

              <span
                className={`h-2 w-2 rounded-full ${
                  connected
                    ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                    : "bg-red-400"
                }`}
              />

              <span
                className={`text-xs ${
                  connected
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {connected
                  ? "Glove Connected"
                  : "Disconnected"}
              </span>

              <Wifi
                size={14}
                className={
                  connected
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              />

            </div>

            {/* EMERGENCY SOUND */}

            <button
              onClick={
                enableEmergencySound
              }
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                soundEnabled
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {soundEnabled
                ? "🔊 Emergency Sound ON"
                : "🔇 Enable Emergency Sound"}
            </button>

            {/* NOTIFICATION */}

            <button
              className={`relative rounded-xl border p-2.5 transition ${
                darkMode
                  ? "border-white/10 bg-white/[0.03] text-gray-400 hover:text-white"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900"
              }`}
            >

              <Bell size={19} />

              {emergency && (
                <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-red-400" />
              )}

            </button>

            {/* PROFILE */}

            <div className="hidden items-center gap-3 md:flex">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <UserRound size={17} />
              </div>

              <div>

                <p className="text-sm font-medium">
                  Patient
                </p>

                <p className="text-xs text-gray-500">
                  ID: LG-001
                </p>

              </div>

              <ChevronDown
                size={15}
                className="text-gray-500"
              />

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <div className="p-6">
          {activePage === "medicine" ? (
            <MedicineAlerts darkMode={darkMode} />
          ) : (
            <>

          {/* WELCOME */}

          <section className="mb-6 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-purple-500/5 to-transparent p-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <div className="mb-2 flex items-center gap-2">

                  <ShieldCheck
                    size={18}
                    className="text-emerald-400"
                  />

                  <span className="text-sm text-emerald-400">
                    {connected
                      ? "Monitoring Active"
                      : "Waiting for Glove"}
                  </span>

                </div>

                <h1 className="text-2xl font-bold md:text-3xl">

                  Welcome to{" "}

                  <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                    LifeGuard
                  </span>

                </h1>

                <p className="mt-2 max-w-xl text-sm text-gray-500">
                  Your Smart Glove continuously
                  monitors vital health
                  parameters and detects
                  emergency gestures in real
                  time.
                </p>

              </div>

              <div
                className={`flex items-center gap-3 rounded-xl border p-4 ${
                  darkMode
                    ? "border-white/10 bg-black/20"
                    : "border-gray-200 bg-white/70"
                }`}
              >

                <Watch
                  className="text-violet-400"
                  size={25}
                />

                <div>

                  <p className="text-xs text-gray-500">
                    Device
                  </p>

                  <p className="font-semibold">
                    LifeGuard Glove
                  </p>

                  <p
                    className={`text-xs ${
                      connected
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    ●{" "}
                    {connected
                      ? "Online"
                      : "Offline"}
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ================= VITAL CARDS ================= */}

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {vitals.map((item) => {

              const Icon = item.icon;

     return (
  <div
    key={item.title}
    className={`group rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${
      
      // 🚨 EMERGENCY BPM HIGHLIGHT
      item.title === "Heart Rate" && bpmEmergency
        ? "border-2 border-red-500 bg-red-500/10 shadow-xl shadow-red-900/50 animate-pulse"

        // ✅ NORMAL DARK/LIGHT THEME — SAME COLOURS
        : darkMode
        ? "border-white/10 bg-[#0a0f20] hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-900/10"
        : "border-gray-200 bg-white shadow-sm hover:border-violet-300 hover:shadow-lg"
    }`}
  >

                  <div className="flex items-start justify-between">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}
                    >
                      <Icon
                        size={21}
                        className={item.iconColor}
                      />
                    </div>

                    <span
                      className={`flex items-center gap-1 text-xs ${
                        item.status ===
                        "Check"
                          ? "text-orange-400"
                          : "text-emerald-400"
                      }`}
                    >

                      {item.status ===
                      "Check" ? (
                        <AlertTriangle
                          size={13}
                        />
                      ) : (
                        <CheckCircle2
                          size={13}
                        />
                      )}

                      {item.status}

                    </span>

                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    {item.title}
                  </p>

                  <div className="mt-1 flex items-end gap-2">

                    <span className="text-3xl font-bold">
                      {item.value}
                    </span>

                    <span className="mb-1 text-sm text-gray-500">
                      {item.unit}
                    </span>

                  </div>

                  <div
                    className={`mt-4 h-1.5 overflow-hidden rounded-full ${
                      darkMode
                        ? "bg-white/5"
                        : "bg-gray-100"
                    }`}
                  >

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                      style={{
                        width:
                          item.title ===
                            "Heart Rate" &&
                          numericBpm > 0
                            ? `${Math.min(
                                100,
                                numericBpm
                              )}%`
                            : item.title ===
                                "Temperature" &&
                              numericTemperature >
                                0
                            ? `${Math.min(
                                100,
                                numericTemperature *
                                  2
                              )}%`
                            : "75%",
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </section>

          {/* ================= MONITORING + GESTURE ================= */}

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            {/* HEART RATE */}

            <div
              className={`${cardClass} xl:col-span-2`}
            >

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <Activity
                      size={19}
                      className="text-violet-400"
                    />

                    <h3 className="font-semibold">
                      Live Heart Rate
                    </h3>

                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Real-time BPM monitoring
                    from Smart Glove
                  </p>

                </div>

                <div className="rounded-lg bg-violet-500/10 px-3 py-2">

                  <span className="text-xl font-bold text-violet-500">
                    {bpm}
                  </span>

                  <span className="ml-1 text-xs text-gray-500">
                    BPM
                  </span>

                </div>

              </div>

              {/* ECG */}

              <div
                className={`relative h-64 overflow-hidden rounded-xl border ${
                  darkMode
                    ? "border-white/5 bg-[#060a17]"
                    : "border-gray-200 bg-gray-50"
                }`}
              >

                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(139,92,246,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.2) 1px, transparent 1px)",
                    backgroundSize:
                      "40px 40px",
                  }}
                />

                <svg
                  viewBox="0 0 1000 250"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >

                  <defs>

                    <linearGradient
                      id="ecgGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >

                      <stop
                        offset="0%"
                        stopColor="#8b5cf6"
                      />

                      <stop
                        offset="100%"
                        stopColor="#e879f9"
                      />

                    </linearGradient>

                  </defs>

                  <polyline
                    fill="none"
                    stroke="url(#ecgGradient)"
                    strokeWidth="4"
                    points="
                    0,130
                    80,130
                    110,130
                    135,100
                    160,180
                    190,130
                    280,130
                    340,130
                    365,80
                    395,185
                    425,130
                    520,130
                    580,130
                    610,95
                    640,180
                    675,130
                    760,130
                    820,130
                    850,75
                    880,190
                    910,130
                    1000,130
                    "
                  />

                </svg>

                <div className="absolute bottom-3 left-4 flex gap-5 text-[11px] text-gray-500">

                  <span>Live</span>
                  <span>10 sec</span>
                  <span>30 sec</span>
                  <span>1 min</span>

                </div>

              </div>

              <div className="mt-4 flex flex-wrap gap-5 text-xs text-gray-500">

                <span className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  Normal range:
                  60–100 BPM

                </span>

                <span className="flex items-center gap-2">

                  <Clock3 size={13} />

                  Live update every
                  2 seconds

                </span>

              </div>

            </div>

            {/* GESTURE */}

            <div className={cardClass}>

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Gesture Detection
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    AI-powered hand gesture
                    recognition
                  </p>

                </div>

                <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
                  <Hand size={20} />
                </div>

              </div>

              <div
                className={`mt-5 flex flex-col items-center justify-center rounded-xl border py-8 ${
                  emergencyGesture
                    ? "border-red-500/30 bg-red-500/10"
                    : "border-violet-500/10 bg-gradient-to-b from-violet-500/10 to-transparent"
                }`}
              >

                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full border ${
                    emergencyGesture
                      ? "border-red-500/40 bg-red-500/10"
                      : "border-violet-500/30 bg-violet-500/10"
                  } shadow-xl`}
                >

                  <Hand
                    size={45}
                    className={
                      emergencyGesture
                        ? "text-red-300"
                        : "text-violet-400"
                    }
                  />

                </div>

                <p className="mt-5 text-xs uppercase tracking-widest text-gray-500">
                  Gesture Detected
                </p>

                <h2
                  className={`mt-1 text-2xl font-bold ${
                    emergencyGesture
                      ? "text-red-300"
                      : "text-violet-400"
                  }`}
                >
                  {gesture}
                </h2>

                <div
                  className={`mt-3 rounded-full px-4 py-1.5 text-xs ${
                    emergencyGesture
                      ? "bg-red-500/10 text-red-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {emergencyGesture
                    ? "Emergency gesture"
                    : "Normal gesture"}
                </div>

              </div>

              <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-purple-500">
                View Gesture History
              </button>

            </div>

          </section>

          {/* ================= 7 DAY ANALYTICS ================= */}

          <section className={`mt-5 ${cardClass}`}>

            <div className="mb-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <TrendingUp
                    size={19}
                    className="text-violet-400"
                  />

                  <h3 className="font-semibold">
                    7-Day Health Analytics
                  </h3>

                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Patient history stored in
                  MongoDB
                </p>

              </div>

              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-500">
                {sevenDayHistory.length}
                {" "}Records
              </span>

            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              <AnalyticsCard
                title="Average BPM"
                value={averageBpm}
                unit="BPM"
                icon={
                  <HeartPulse size={17} />
                }
                darkMode={darkMode}
              />

              <AnalyticsCard
                title="Average Temperature"
                value={
                  averageTemperature
                }
                unit="°C"
                icon={
                  <Thermometer size={17} />
                }
                darkMode={darkMode}
              />

              <AnalyticsCard
                title="Highest BPM"
                value={maximumBpm}
                unit="BPM"
                icon={
                  <TrendingUp size={17} />
                }
                darkMode={darkMode}
              />

              <AnalyticsCard
                title="Lowest BPM"
                value={minimumBpm}
                unit="BPM"
                icon={
                  <Activity size={17} />
                }
                darkMode={darkMode}
              />

            </div>

          </section>

          {/* ================= AI HEALTH ================= */}

          <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-5 lg:col-span-2">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                  <Brain size={22} />
                </div>

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold">
                        AI Health Insight
                      </h3>

                      <p className="text-xs text-gray-500">
                        Current data + 7-day
                        patient history
                      </p>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        aiStatus ===
                        "Emergency"
                          ? "bg-red-500/10 text-red-400"
                          : aiStatus ===
                              "Attention"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {aiStatus}
                    </span>

                  </div>

                  <div
                    className={`mt-4 rounded-xl border p-4 ${
                      darkMode
                        ? "border-white/5 bg-black/20"
                        : "border-gray-200 bg-white/70"
                    }`}
                  >

                    <p className="text-sm leading-6 text-gray-500">
                      {aiMessage}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                      <AIItem
                        icon={
                          <Activity
                            size={16}
                          />
                        }
                        title="Heart"
                        value={
                          bpmNormal
                            ? "Stable"
                            : "Check"
                        }
                        darkMode={
                          darkMode
                        }
                      />

                      <AIItem
                        icon={
                          <Thermometer
                            size={16}
                          />
                        }
                        title="Temperature"
                        value={
                          temperatureNormal
                            ? "Normal"
                            : "Check"
                        }
                        darkMode={
                          darkMode
                        }
                      />

                      <AIItem
                        icon={
                          <Hand size={16} />
                        }
                        title="Gesture"
                        value={gesture}
                        darkMode={
                          darkMode
                        }
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* EMERGENCY CENTER */}

            <div
              className={`rounded-2xl border p-5 ${
                emergency
                  ? "border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent"
                  : "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent"
              }`}
            >

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <AlertTriangle size={22} />
                </div>

                <div>

                  <h3 className="font-semibold">
                    Emergency Center
                  </h3>

                  <p className="text-xs text-gray-500">
                    Quick emergency actions
                  </p>

                </div>

              </div>

              {emergency ? (

                <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">

                  <p className="text-sm font-semibold text-red-400">
                    ⚠ Emergency Detected
                  </p>

                  <ul className="mt-2 space-y-1">

                    {emergencyReason.map(
                      (reason, index) => (
                        <li
                          key={index}
                          className="text-xs text-red-300"
                        >
                          • {reason}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              ) : (

                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">

                  <p className="text-sm font-semibold text-emerald-400">
                    ✓ No Emergency Detected
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Current health parameters
                    are within the monitoring
                    range.
                  </p>

                </div>

              )}

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-400">

                <AlertTriangle size={18} />

                Send Emergency Alert

              </button>

              <div className="mt-3 grid grid-cols-2 gap-3">

                <button
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Stethoscope size={15} />
                  Doctor
                </button>

                <button
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MessageCircle size={15} />
                  Family
                </button>

              </div>

            </div>

          </section>

          {/* ================= MONGODB HISTORY ================= */}

          <section className={`mt-5 ${cardClass}`}>

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Patient Health History
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Real-time records stored
                  from Blynk
                </p>

              </div>

              <span className="text-xs text-violet-500">
                MongoDB
              </span>

            </div>

            {history.length === 0 ? (

              <div
                className={`rounded-xl border p-6 text-center ${
                  darkMode
                    ? "border-white/5 bg-white/[0.02]"
                    : "border-gray-200 bg-gray-50"
                }`}
              >

                <Activity
                  size={25}
                  className="mx-auto text-gray-500"
                />

                <p className="mt-3 text-sm text-gray-500">
                  No patient records
                  available yet.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {history
                  .slice(0, 10)
                  .map(
                    (record, index) => {

                      const recordBpm =
                        Number(
                          record.bpm
                        );

                      const recordTemperature =
                        Number(
                          record.temperature
                        );

                      const recordEmergency =
                        String(
                          record.gesture ||
                            ""
                        )
                          .toLowerCase()
                          .includes(
                            "help"
                          );

                      return (

                        <div
                          key={
                            record._id ||
                            index
                          }
                          className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between ${
                            darkMode
                              ? "border-white/5 bg-white/[0.02]"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                recordEmergency
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-violet-500/10 text-violet-400"
                              }`}
                            >

                              {recordEmergency ? (
                                <AlertTriangle
                                  size={18}
                                />
                              ) : (
                                <Activity
                                  size={18}
                                />
                              )}

                            </div>

                            <div>

                              <p className="text-sm font-medium">
                                Health Record
                              </p>

                              <p className="text-xs text-gray-500">

                                {record.timestamp
                                  ? new Date(
                                      record.timestamp
                                    ).toLocaleString()
                                  : "Unknown time"}

                              </p>

                            </div>

                          </div>

                          <div className="grid grid-cols-3 gap-5 text-right">

                            <div>

                              <p className="text-xs text-gray-500">
                                BPM
                              </p>

                              <p className="font-semibold text-red-400">
                                {recordBpm ||
                                  "--"}
                              </p>

                            </div>

                            <div>

                              <p className="text-xs text-gray-500">
                                Temp
                              </p>

                              <p className="font-semibold text-orange-400">
                                {recordTemperature ||
                                  "--"}
                                °C
                              </p>

                            </div>

                            <div>

                              <p className="text-xs text-gray-500">
                                Gesture
                              </p>

                              <p
                                className={`font-semibold ${
                                  recordEmergency
                                    ? "text-red-400"
                                    : "text-violet-400"
                                }`}
                              >
                                {record.gesture ||
                                  "--"}
                              </p>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>

            )}

          </section>

          {/* ================= RECENT ACTIVITY ================= */}

          <section className={`mt-5 ${cardClass}`}>

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Recent Monitoring Activity
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Latest events detected by
                  LifeGuard
                </p>

              </div>

              <span className="text-xs text-violet-500">
                Live
              </span>

            </div>

            <div className="space-y-3">

              <ActivityItem
                icon={
                  <HeartPulse size={17} />
                }
                title="Heart rate measured"
                description={`${bpm} BPM detected`}
                time="Live"
                type={
                  bpmNormal
                    ? "normal"
                    : "warning"
                }
                darkMode={darkMode}
              />

              <ActivityItem
                icon={<Hand size={17} />}
                title="Gesture detected"
                description={`${gesture} gesture received from Smart Glove`}
                time="Live"
                type={
                  emergencyGesture
                    ? "warning"
                    : "normal"
                }
                darkMode={darkMode}
              />

              <ActivityItem
                icon={
                  <Thermometer
                    size={17}
                  />
                }
                title="Temperature measured"
                description={`${temperature}°C detected`}
                time="Live"
                type={
                  temperatureNormal
                    ? "normal"
                    : "warning"
                }
                darkMode={darkMode}
              />

              <ActivityItem
                icon={<Wifi size={17} />}
                title="Smart Glove connection"
                description={
                  connected
                    ? "Device connection established"
                    : "Waiting for device connection"
                }
                time="Live"
                type={
                  connected
                    ? "normal"
                    : "warning"
                }
                darkMode={darkMode}
              />

            </div>

          </section>

                {/* FOOTER */}

          <footer className="py-8 text-center text-xs text-gray-500">
            LifeGuard Smart Healthcare • AI
            Assisted Patient Monitoring
          </footer>

        </>
      )}
    </div>

  </main>

</div>

  );
};

  


// ==========================================
// SIDEBAR ITEM
// ==========================================

const SidebarItem = ({
  icon,
  text,
  active,
  open,
  darkMode,
  onClick,
}) => {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 flex w-full items-center rounded-xl px-3 py-3 text-sm transition ${
        active
          ? "bg-violet-500/15 text-violet-500 shadow-inner"
          : darkMode
          ? "text-gray-500 hover:bg-white/5 hover:text-gray-200"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      } ${
        open
          ? ""
          : "justify-center"
      }`}
    >

      {icon}

      {open && (
        <span className="ml-3">
          {text}
        </span>
      )}

      {open && active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
      )}

    </button>
  );
};

// ==========================================
// AI ITEM
// ==========================================

const AIItem = ({
  icon,
  title,
  value,
  darkMode,
}) => {

  return (
    <div
      className={`rounded-lg border p-3 ${
        darkMode
          ? "border-white/5 bg-white/[0.02]"
          : "border-gray-200 bg-gray-50"
      }`}
    >

      <div className="flex items-center gap-2 text-gray-500">

        {icon}

        <span className="text-xs">
          {title}
        </span>

      </div>

      <p
        className={`mt-1 text-sm font-semibold ${
          value === "Check"
            ? "text-orange-400"
            : "text-emerald-400"
        }`}
      >
        {value}
      </p>

    </div>
  );
};

// ==========================================
// ANALYTICS CARD
// ==========================================

const AnalyticsCard = ({
  title,
  value,
  unit,
  icon,
  darkMode,
}) => {

  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-white/5 bg-white/[0.02]"
          : "border-gray-200 bg-gray-50"
      }`}
    >

      <div className="flex items-center gap-2 text-gray-500">

        {icon}

        <span className="text-xs">
          {title}
        </span>

      </div>

      <div className="mt-3 flex items-end gap-1">

        <span
          className={`text-2xl font-bold ${
            darkMode
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          {value}
        </span>

        <span className="mb-1 text-xs text-gray-500">
          {unit}
        </span>

      </div>

    </div>
  );
};

// ==========================================
// ACTIVITY ITEM
// ==========================================

const ActivityItem = ({
  icon,
  title,
  description,
  time,
  type,
  darkMode,
}) => {

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-3 ${
        darkMode
          ? "border-white/5 bg-white/[0.02]"
          : "border-gray-200 bg-gray-50"
      }`}
    >

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          type === "warning"
            ? "bg-orange-500/10 text-orange-400"
            : "bg-violet-500/10 text-violet-400"
        }`}
      >
        {icon}
      </div>

      <div className="flex-1">

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {description}
        </p>

      </div>

      <span className="text-xs text-gray-500">
        {time}
      </span>

      <BotpressChat />
    </div>
  );
};

export default Dashboard;