import React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Activity,
  BellRing,
  Hand,
  ShieldCheck,
  ArrowRight,
  Wifi,
  Thermometer,
  BatteryFull,
  MapPin,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="lifeguard-bg min-h-screen overflow-x-hidden text-white">

      {/* Background Effects */}
      <div className="lifeguard-grid pointer-events-none absolute inset-0" />
      <div className="lifeguard-glow-one pointer-events-none absolute" />
      <div className="lifeguard-glow-two pointer-events-none absolute" />

      <div className="relative z-10">

        {/* ================= NAVBAR ================= */}

        <header className="fixed left-0 right-0 top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">

            <nav className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/75 px-4 shadow-2xl backdrop-blur-xl sm:px-6">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 shadow-lg shadow-violet-500/20 sm:h-11 sm:w-11">
                  <HeartPulse size={23} className="text-white" />
                </div>

                <div>
                  <h1 className="text-base font-bold tracking-tight sm:text-lg">
                    LifeGuard
                  </h1>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-300 sm:text-[10px]">
                    Smart Healthcare
                  </p>
                </div>

              </Link>

              {/* Login / Register */}
              <div className="flex items-center gap-1 sm:gap-2">

                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:px-5"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-400 sm:px-5"
                >
                  Register
                </Link>

              </div>

            </nav>

          </div>
        </header>

        {/* ================= HERO ================= */}

        <main>

          <section className="relative min-h-screen pt-28 sm:pt-32">

            <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-20">

              {/* LEFT SIDE */}

              <div className="max-w-2xl">

                {/* Badge */}

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-violet-300 sm:text-sm">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />

                  AI-Powered Smart Healthcare

                </div>

                {/* Project Name */}

                <h2 className="max-w-3xl text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">

                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-400 bg-clip-text text-transparent">

                    AI Smart Glove for Patient Monitoring with AI Dashboard and Emergency Alert System.

                  </span>

                </h2>

                {/* Description */}

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">

                  LifeGuard Smart Glove is an intelligent healthcare solution
                  designed for real-time patient monitoring, gesture
                  recognition and instant emergency alerts.

                </p>

                {/* Buttons */}

                <div className="mt-8 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">

                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-3 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition duration-300 hover:-translate-y-1 hover:bg-violet-400 sm:px-6 sm:text-base"
                  >
                    Get Started

                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-slate-200 transition duration-300 hover:border-violet-400/30 hover:bg-violet-400/5 sm:px-6 sm:text-base"
                  >
                    Already registered?

                    <span className="text-violet-300">
                      Login
                    </span>
                  </Link>

                </div>

                {/* Trust Items */}

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                  <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
                    <ShieldCheck size={17} className="text-violet-400" />
                    Secure Monitoring
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
                    <Wifi size={17} className="text-emerald-400" />
                    Real-Time Data
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
                    <BellRing size={17} className="text-rose-400" />
                    Instant Alerts
                  </div>

                </div>

              </div>

              {/* ================= RIGHT DASHBOARD ================= */}

              <div className="relative mx-auto w-full max-w-xl">

                {/* Dashboard Glow */}

                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl sm:h-96 sm:w-96" />

                {/* Main Dashboard Card */}

                <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">

                  {/* Dashboard Header */}

                  <div className="mb-5 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 sm:h-11 sm:w-11">
                        <Activity size={21} className="text-violet-400" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold sm:text-base">
                          Live Health Monitor
                        </p>

                        <p className="text-[10px] text-slate-500 sm:text-xs">
                          LifeGuard Smart Glove
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1.5 text-[10px] text-emerald-400 sm:px-3 sm:text-xs">

                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                      Connected

                    </div>

                  </div>

                  {/* Heart Rate */}

                  <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-4 sm:p-5">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs text-slate-400 sm:text-sm">
                          Heart Rate
                        </p>

                        <div className="mt-1 flex items-end gap-2">

                          <span className="text-4xl font-bold sm:text-5xl">
                            72
                          </span>

                          <span className="mb-1.5 text-xs text-slate-500 sm:mb-2 sm:text-sm">
                            BPM
                          </span>

                        </div>

                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 sm:h-12 sm:w-12">
                        <HeartPulse size={23} className="text-rose-400" />
                      </div>

                    </div>

                    {/* ECG */}

                    <div className="mt-5 h-16 overflow-hidden sm:h-20">

                      <svg
                        viewBox="0 0 500 80"
                        className="h-full w-full"
                        preserveAspectRatio="none"
                      >

                        <polyline
                          points="0,42 70,42 95,42 115,15 140,65 165,42 235,42 260,42 280,15 305,65 330,42 400,42 425,42 445,15 470,65 500,42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-violet-400"
                        />

                      </svg>

                    </div>

                  </div>

                  {/* Temperature + Battery */}

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">

                    {/* Temperature */}

                    <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3.5 sm:p-4">

                      <div className="flex items-center justify-between">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10 sm:h-9 sm:w-9">
                          <Thermometer size={17} className="text-orange-400" />
                        </div>

                        <span className="text-[10px] text-emerald-400 sm:text-xs">
                          Normal
                        </span>

                      </div>

                      <p className="mt-3 text-[10px] text-slate-500 sm:mt-4 sm:text-xs">
                        Temperature
                      </p>

                      <p className="mt-1 text-xl font-bold sm:text-2xl">
                        36.7°C
                      </p>

                    </div>

                    {/* Battery */}

                    <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3.5 sm:p-4">

                      <div className="flex items-center justify-between">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 sm:h-9 sm:w-9">
                          <BatteryFull size={17} className="text-violet-400" />
                        </div>

                        <span className="text-[10px] text-emerald-400 sm:text-xs">
                          Good
                        </span>

                      </div>

                      <p className="mt-3 text-[10px] text-slate-500 sm:mt-4 sm:text-xs">
                        Glove Battery
                      </p>

                      <p className="mt-1 text-xl font-bold sm:text-2xl">
                        87%
                      </p>

                    </div>

                  </div>

                  {/* Patient Status */}

                  <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-violet-400/10 bg-violet-400/5 p-3.5 sm:p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 sm:h-10 sm:w-10">
                        <ShieldCheck size={18} className="text-violet-400" />
                      </div>

                      <div>

                        <p className="text-xs font-semibold sm:text-sm">
                          Patient Status
                        </p>

                        <p className="text-[10px] text-emerald-400 sm:text-xs">
                          All parameters normal
                        </p>

                      </div>

                    </div>

                    <div className="rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-400 sm:px-3 sm:text-xs">
                      Safe
                    </div>

                  </div>

                </div>

                {/* Gesture Card */}

                <div className="absolute -left-4 top-24 hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-400/10">
                    <Hand size={18} className="text-purple-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      Gesture Detected
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Help gesture
                    </p>
                  </div>

                </div>

                {/* GPS Card */}

                <div className="absolute -right-4 bottom-20 hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-400/10">
                    <MapPin size={18} className="text-rose-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      GPS Connected
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Location active
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ================= FEATURES ================= */}

          <section className="border-t border-white/5 py-20 sm:py-24">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

              <div className="mx-auto max-w-2xl text-center">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400 sm:text-sm">
                  Smart Healthcare
                </p>

                <h3 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
                  One glove. Multiple intelligent capabilities.
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  LifeGuard combines health monitoring, gesture recognition
                  and emergency communication into one connected solution.
                </p>

              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">

                {/* Card 1 */}

                <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-400/[0.04] sm:p-6">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10">
                    <Activity size={21} className="text-violet-400" />
                  </div>

                  <h4 className="mt-5 text-base font-bold sm:text-lg">
                    Real-Time Monitoring
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Monitor important health parameters continuously
                    through the connected smart glove.
                  </p>

                </div>

                {/* Card 2 */}

                <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-rose-400/30 hover:bg-rose-400/[0.04] sm:p-6">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-400/10">
                    <BellRing size={21} className="text-rose-400" />
                  </div>

                  <h4 className="mt-5 text-base font-bold sm:text-lg">
                    Emergency Alerts
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Detect abnormal conditions and provide instant
                    emergency notifications.
                  </p>

                </div>

                {/* Card 3 */}

                <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-purple-400/[0.04] sm:p-6">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10">
                    <Hand size={21} className="text-purple-400" />
                  </div>

                  <h4 className="mt-5 text-base font-bold sm:text-lg">
                    Gesture Recognition
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Enable intuitive hands-free communication through
                    intelligent gesture detection.
                  </p>

                </div>

                {/* Card 4 */}

                <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-400/[0.04] sm:p-6">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
                    <ShieldCheck size={21} className="text-emerald-400" />
                  </div>

                  <h4 className="mt-5 text-base font-bold sm:text-lg">
                    Connected Care
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Keep essential patient information accessible from
                    one connected healthcare platform.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* ================= CTA ================= */}

          <section className="px-4 py-20 sm:px-6 sm:py-24">

            <div className="mx-auto max-w-5xl rounded-3xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/5 px-6 py-14 text-center sm:px-14 sm:py-16">

              <h3 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                Ready to experience smarter healthcare?
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Create your LifeGuard account and explore the future of
                connected patient monitoring.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition duration-300 hover:-translate-y-1 hover:bg-violet-400 sm:text-base"
              >
                Create Account
                <ArrowRight size={18} />
              </Link>

            </div>

          </section>

        </main>


        {/* ================= FOOTER ================= */}

        <footer className="border-t border-white/5 py-7">

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">

            <div className="flex items-center gap-2">

              <HeartPulse
                size={18}
                className="text-violet-400"
              />

              <span className="text-sm font-semibold">
                LifeGuard Smart Glove
              </span>

            </div>

            <p className="text-xs text-slate-500">
              © 2026 LifeGuard AI Health
            </p>

          </div>

        </footer>

      </div>
    </div>
  );
};

export default LandingPage;