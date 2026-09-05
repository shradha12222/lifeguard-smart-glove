import React, { useMemo } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Thermometer,
  HeartPulse,
  Sparkles,
} from "lucide-react";

const FutureHealthPrediction = ({
  bpm,
  temperature,
  history = [],
  darkMode,
}) => {
  // ==========================================
  // CONVERT HISTORY INTO NUMBERS
  // ==========================================

  const prediction = useMemo(() => {
    const records = history
      .map((item) => ({
        bpm: Number(item.bpm),
        temperature: Number(item.temperature),
        timestamp: item.timestamp,
      }))
      .filter(
        (item) =>
          Number.isFinite(item.bpm) &&
          item.bpm > 0 &&
          Number.isFinite(item.temperature) &&
          item.temperature > 0
      );

    const currentBpm = Number(bpm);
    const currentTemp = Number(temperature);

    if (
      !Number.isFinite(currentBpm) ||
      !Number.isFinite(currentTemp)
    ) {
      return {
        overallRisk: "Insufficient Data",
        riskScore: 0,
        predictions: [],
        recommendation:
          "Collect more health data to generate a reliable risk assessment.",
      };
    }

    // ==========================================
    // RECENT DATA
    // ==========================================

    const recentRecords = records.slice(-10);

    const bpmValues = recentRecords.map((r) => r.bpm);
    const tempValues = recentRecords.map(
      (r) => r.temperature
    );

    // ==========================================
    // AVERAGES
    // ==========================================

    const avgBpm =
      bpmValues.length > 0
        ? bpmValues.reduce((a, b) => a + b, 0) /
          bpmValues.length
        : currentBpm;

    const avgTemp =
      tempValues.length > 0
        ? tempValues.reduce((a, b) => a + b, 0) /
          tempValues.length
        : currentTemp;

    // ==========================================
    // TREND CALCULATION
    // ==========================================

    let bpmTrend = 0;
    let tempTrend = 0;

    if (bpmValues.length >= 2) {
      bpmTrend =
        bpmValues[bpmValues.length - 1] -
        bpmValues[0];
    }

    if (tempValues.length >= 2) {
      tempTrend =
        tempValues[tempValues.length - 1] -
        tempValues[0];
    }

    // ==========================================
    // RISK SCORES
    // ==========================================

    let cardiovascularRisk = 0;
    let feverRisk = 0;
    let stressRisk = 0;

    // ------------------------------------------
    // HEART RATE RISK
    // ------------------------------------------

    if (currentBpm > 120) {
      cardiovascularRisk += 35;
      stressRisk += 20;
    }

    if (currentBpm < 50) {
      cardiovascularRisk += 40;
    }

    if (avgBpm > 100) {
      cardiovascularRisk += 20;
    }

    if (avgBpm < 60) {
      cardiovascularRisk += 15;
    }

    if (bpmTrend > 15) {
      cardiovascularRisk += 15;
      stressRisk += 15;
    }

    // ------------------------------------------
    // TEMPERATURE RISK
    // ------------------------------------------

    if (currentTemp > 38) {
      feverRisk += 40;
    }

    if (currentTemp > 37.5) {
      feverRisk += 20;
    }

    if (avgTemp > 37.5) {
      feverRisk += 20;
    }

    if (tempTrend > 0.5) {
      feverRisk += 20;
    }

    // ------------------------------------------
    // STRESS / PHYSIOLOGICAL LOAD
    // ------------------------------------------

    if (currentBpm > 100 && currentTemp > 37.5) {
      stressRisk += 25;
    }

    if (avgBpm > 95) {
      stressRisk += 15;
    }

    // ==========================================
    // LIMIT SCORE
    // ==========================================

    cardiovascularRisk = Math.min(
      cardiovascularRisk,
      100
    );

    feverRisk = Math.min(feverRisk, 100);

    stressRisk = Math.min(stressRisk, 100);

    // ==========================================
    // OVERALL SCORE
    // ==========================================

    const overallScore = Math.round(
      Math.max(
        cardiovascularRisk,
        feverRisk,
        stressRisk
      )
    );

    // ==========================================
    // RISK LEVEL
    // ==========================================

    let overallRisk = "Low";

    if (overallScore >= 60) {
      overallRisk = "High";
    } else if (overallScore >= 30) {
      overallRisk = "Moderate";
    }

    // ==========================================
    // PREDICTIONS
    // ==========================================

    const predictions = [];

    if (cardiovascularRisk >= 30) {
      predictions.push({
        title: "Cardiovascular Stress",
        score: cardiovascularRisk,
        description:
          "Repeated abnormal heart-rate patterns may indicate increased cardiovascular stress.",
        icon: HeartPulse,
        color: "red",
      });
    }

    if (feverRisk >= 30) {
      predictions.push({
        title: "Fever / Infection Risk",
        score: feverRisk,
        description:
          "Increasing temperature patterns may indicate a developing fever or inflammatory condition.",
        icon: Thermometer,
        color: "orange",
      });
    }

    if (stressRisk >= 30) {
      predictions.push({
        title: "Physiological Stress",
        score: stressRisk,
        description:
          "Heart-rate and temperature patterns suggest increased physiological load.",
        icon: Activity,
        color: "yellow",
      });
    }

    if (predictions.length === 0) {
      predictions.push({
        title: "No Significant Risk Pattern",
        score: overallScore,
        description:
          "Current and recent vital-sign patterns do not show a significant elevated-risk pattern.",
        icon: ShieldCheck,
        color: "green",
      });
    }

    // ==========================================
    // RECOMMENDATION
    // ==========================================

    let recommendation =
      "Continue regular monitoring and maintain healthy daily habits.";

    if (overallRisk === "Moderate") {
      recommendation =
        "Continue monitoring closely. If abnormal patterns persist, consider consulting a healthcare professional.";
    }

    if (overallRisk === "High") {
      recommendation =
        "Abnormal health patterns detected. Medical evaluation is recommended, especially if symptoms are present.";
    }

    return {
      overallRisk,
      riskScore: overallScore,
      predictions,
      recommendation,
      avgBpm,
      avgTemp,
      bpmTrend,
      tempTrend,
    };
  }, [bpm, temperature, history]);

  // ==========================================
  // RISK COLORS
  // ==========================================

  const getRiskClass = () => {
    if (prediction.overallRisk === "High") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (prediction.overallRisk === "Moderate") {
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    }

    if (prediction.overallRisk === "Low") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    }

    return "border-gray-500/30 bg-gray-500/10 text-gray-400";
  };

  return (
    <section
      className={`mt-5 rounded-2xl border p-5 ${
        darkMode
          ? "border-violet-500/20 bg-[#0a0f20]"
          : "border-violet-200 bg-white shadow-sm"
      }`}
    >
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-400">
            <Brain size={24} />
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h3 className="text-lg font-semibold">
                AI Future Health Prediction
              </h3>

              <Sparkles
                size={16}
                className="text-violet-400"
              />

            </div>

            <p className="mt-1 text-xs text-gray-500">
              AI-assisted early risk detection using
              current vitals and patient history
            </p>

          </div>

        </div>

        {/* RISK BADGE */}

        <div
          className={`rounded-full border px-4 py-2 text-xs font-semibold ${getRiskClass()}`}
        >
          Risk Level: {prediction.overallRisk}
        </div>

      </div>

      {/* ==========================================
          AI SCORE
      ========================================== */}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* SCORE */}

        <div
          className={`rounded-xl border p-4 ${
            darkMode
              ? "border-white/5 bg-white/[0.02]"
              : "border-gray-200 bg-gray-50"
          }`}
        >

          <p className="text-xs text-gray-500">
            Overall Risk Score
          </p>

          <div className="mt-2 flex items-end gap-2">

            <span className="text-3xl font-bold text-violet-400">
              {prediction.riskScore}
            </span>

            <span className="mb-1 text-xs text-gray-500">
              / 100
            </span>

          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-500/10">

            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
              style={{
                width: `${prediction.riskScore}%`,
              }}
            />

          </div>

        </div>

        {/* BPM TREND */}

        <div
          className={`rounded-xl border p-4 ${
            darkMode
              ? "border-white/5 bg-white/[0.02]"
              : "border-gray-200 bg-gray-50"
          }`}
        >

          <div className="flex items-center gap-2">

            {prediction.bpmTrend > 0 ? (
              <TrendingUp
                size={18}
                className="text-orange-400"
              />
            ) : (
              <TrendingDown
                size={18}
                className="text-emerald-400"
              />
            )}

            <p className="text-xs text-gray-500">
              Heart Rate Trend
            </p>

          </div>

          <p className="mt-2 text-xl font-bold">
            {prediction.bpmTrend > 0
              ? "+"
              : ""}
            {prediction.bpmTrend.toFixed(1)}
            <span className="ml-1 text-xs text-gray-500">
              BPM
            </span>
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Avg: {prediction.avgBpm.toFixed(1)} BPM
          </p>

        </div>

        {/* TEMPERATURE TREND */}

        <div
          className={`rounded-xl border p-4 ${
            darkMode
              ? "border-white/5 bg-white/[0.02]"
              : "border-gray-200 bg-gray-50"
          }`}
        >

          <div className="flex items-center gap-2">

            <Thermometer
              size={18}
              className="text-orange-400"
            />

            <p className="text-xs text-gray-500">
              Temperature Trend
            </p>

          </div>

          <p className="mt-2 text-xl font-bold">
            {prediction.tempTrend > 0
              ? "+"
              : ""}
            {prediction.tempTrend.toFixed(2)}
            <span className="ml-1 text-xs text-gray-500">
              °C
            </span>
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Avg: {prediction.avgTemp.toFixed(1)} °C
          </p>

        </div>

      </div>

      {/* ==========================================
          PREDICTIONS
      ========================================== */}

      <div className="mt-5">

        <div className="mb-3 flex items-center gap-2">

          <Brain
            size={17}
            className="text-violet-400"
          />

          <h4 className="text-sm font-semibold">
            Detected Future Health Risks
          </h4>

        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">

          {prediction.predictions.map(
            (item, index) => {

              const Icon = item.icon;

              const colorClass =
                item.color === "red"
                  ? "border-red-500/20 bg-red-500/5"
                  : item.color === "orange"
                  ? "border-orange-500/20 bg-orange-500/5"
                  : item.color === "yellow"
                  ? "border-yellow-500/20 bg-yellow-500/5"
                  : "border-emerald-500/20 bg-emerald-500/5";

              const iconClass =
                item.color === "red"
                  ? "text-red-400"
                  : item.color === "orange"
                  ? "text-orange-400"
                  : item.color === "yellow"
                  ? "text-yellow-400"
                  : "text-emerald-400";

              return (
                <div
                  key={index}
                  className={`rounded-xl border p-4 ${colorClass}`}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Icon
                        size={20}
                        className={iconClass}
                      />

                      <p className="text-sm font-semibold">
                        {item.title}
                      </p>

                    </div>

                    <span
                      className={`text-xs font-bold ${iconClass}`}
                    >
                      {item.score}%
                    </span>

                  </div>

                  <p className="mt-3 text-xs leading-5 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-500/10">

                    <div
                      className="h-full rounded-full bg-current transition-all"
                      style={{
                        width: `${item.score}%`,
                      }}
                    />

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* ==========================================
          AI RECOMMENDATION
      ========================================== */}

      <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">

        <div className="flex items-start gap-3">

          <ShieldCheck
            size={20}
            className="mt-0.5 text-violet-400"
          />

          <div>

            <p className="text-sm font-semibold">
              AI Recommendation
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {prediction.recommendation}
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
          DISCLAIMER
      ========================================== */}

      <div className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-gray-500">

        <AlertTriangle
          size={13}
          className="mt-0.5 shrink-0"
        />

        <p>
          This AI feature provides an early health-risk
          estimate based on monitored patterns. It is
          not a medical diagnosis and should not replace
          professional medical evaluation.
        </p>

      </div>

    </section>
  );
};

export default FutureHealthPrediction;