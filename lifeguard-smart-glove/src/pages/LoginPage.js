import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const savedUser = JSON.parse(localStorage.getItem("lifeguardUser"));

    if (!savedUser) {
      setError("No registered account found. Please register first.");
      return;
    }

    if (
      email.trim().toLowerCase() !== savedUser.email.toLowerCase() ||
      password !== savedUser.password
    ) {
      setError("Invalid email or password.");
      return;
    }

if (rememberMe) {
  localStorage.setItem("lifeguardRemember", "true");
}

// Mark user as logged in
localStorage.setItem("isLoggedIn", "true");

// Go to Dashboard
navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-cyan-500/10 to-blue-600/10">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <HeartPulse size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                LifeGuard
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                Smart Healthcare
              </p>
            </div>
          </Link>

          {/* Content */}
          <div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-6">
              <ShieldCheck
                size={28}
                className="text-cyan-400"
              />
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Welcome back to
              <span className="block text-cyan-400 mt-1">
                smarter healthcare.
              </span>
            </h2>

            <p className="text-slate-400 mt-5 leading-7 max-w-md">
              Sign in to access LifeGuard Smart Glove and continue
              monitoring intelligent healthcare data.
            </p>
          </div>

          {/* Bottom */}
          <p className="text-xs text-slate-500">
            AI-powered patient monitoring & emergency care
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-7 sm:p-10 lg:p-12">

          {/* Mobile Logo */}
          <Link
            to="/"
            className="lg:hidden flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <HeartPulse size={22} />
            </div>

            <div>
              <h1 className="font-bold">
                LifeGuard
              </h1>

              <p className="text-[9px] uppercase tracking-widest text-cyan-400">
                Smart Healthcare
              </p>
            </div>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-cyan-400 text-sm font-semibold mb-2">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold">
              Sign in to your account
            </h2>

            <p className="text-slate-400 text-sm mt-3">
              Enter your registered details to continue.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  onClick={() =>
                    alert("Password recovery will be added later.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">

              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />

              <label
                htmlFor="remember"
                className="text-sm text-slate-400 cursor-pointer"
              >
                Remember me
              </label>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 shadow-lg shadow-cyan-500/10"
            >
              Login
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

          </form>

          {/* Register */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
            <ShieldCheck size={15} />
            Secure healthcare access
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;