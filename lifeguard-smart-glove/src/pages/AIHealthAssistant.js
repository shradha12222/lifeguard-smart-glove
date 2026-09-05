import React, { useState } from "react";
import {
  Brain,
  HeartPulse,
  Thermometer,
  Activity,
  Send,
  ShieldCheck,
} from "lucide-react";

const AIHealthAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm LifeGuard AI. I can analyze your health data, explain your vitals, and identify potential future health risks.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
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

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.reply ||
            "Sorry, I could not generate a response.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Unable to connect to LifeGuard AI.",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      {/* HEADER */}

      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
            <Brain size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              AI Health Assistant
            </h1>

            <p className="text-sm text-gray-500">
              Intelligent health analysis powered by AI
            </p>
          </div>

        </div>

      </div>

      {/* HEALTH OVERVIEW */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">

        <div className="rounded-2xl border border-white/10 bg-[#0a0f20] p-5">

          <div className="flex items-center gap-3">

            <HeartPulse className="text-red-400" />

            <div>
              <p className="text-xs text-gray-500">
                Heart Rate
              </p>

              <h2 className="text-2xl font-bold">
                --
                <span className="text-sm text-gray-500">
                  {" "}BPM
                </span>
              </h2>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0f20] p-5">

          <div className="flex items-center gap-3">

            <Thermometer className="text-orange-400" />

            <div>
              <p className="text-xs text-gray-500">
                Temperature
              </p>

              <h2 className="text-2xl font-bold">
                --
                <span className="text-sm text-gray-500">
                  {" "}°C
                </span>
              </h2>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0f20] p-5">

          <div className="flex items-center gap-3">

            <Activity className="text-violet-400" />

            <div>
              <p className="text-xs text-gray-500">
                AI Status
              </p>

              <h2 className="text-lg font-bold text-emerald-400">
                Monitoring
              </h2>
            </div>

          </div>

        </div>

      </div>

      {/* AI PREDICTION */}

      <div className="mb-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-6">

        <div className="flex items-center gap-3">

          <Brain className="text-violet-400" />

          <h2 className="text-lg font-bold">
            🔮 Future Health Risk Analysis
          </h2>

        </div>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          LifeGuard AI will analyze your current health
          parameters and historical data to identify
          potential health risks and abnormal trends.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500">
              Cardiovascular Risk
            </p>

            <p className="mt-2 font-semibold text-emerald-400">
              Low
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500">
              Temperature-related Risk
            </p>

            <p className="mt-2 font-semibold text-emerald-400">
              Low
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500">
              Overall Health Risk
            </p>

            <p className="mt-2 font-semibold text-emerald-400">
              Monitoring
            </p>
          </div>

        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={15} className="text-emerald-400" />
          AI prediction is an early-warning risk assessment,
          not a medical diagnosis.
        </div>

      </div>

      {/* CHAT */}

      <div className="rounded-2xl border border-white/10 bg-[#0a0f20]">

        <div className="border-b border-white/10 p-5">

          <div className="flex items-center gap-3">

            <Brain className="text-violet-400" />

            <div>
              <h2 className="font-semibold">
                Chat with LifeGuard AI
              </h2>

              <p className="text-xs text-gray-500">
                Ask anything about your health data
              </p>
            </div>

          </div>

        </div>

        {/* MESSAGES */}

        <div className="h-[400px] overflow-y-auto p-5 space-y-4">

          {messages.map((item, index) => (

            <div
              key={index}
              className={`flex ${
                item.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                  item.role === "user"
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 text-gray-300 border border-white/5"
                }`}
              >
                {item.text}
              </div>

            </div>

          ))}

        </div>

        {/* INPUT */}

        <div className="border-t border-white/10 p-4">

          <div className="flex gap-3">

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask LifeGuard AI..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-violet-500"
            />

            <button
              onClick={sendMessage}
              className="rounded-xl bg-violet-600 px-5 text-white hover:bg-violet-500"
            >
              <Send size={18} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AIHealthAssistant;