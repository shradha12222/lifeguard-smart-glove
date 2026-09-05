import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Patient",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword, role } = formData;

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the terms and conditions.");
      return;
    }

    const existingUser = JSON.parse(
      localStorage.getItem("lifeguardUser")
    );

    if (
      existingUser &&
      existingUser.email.toLowerCase() === email.trim().toLowerCase()
    ) {
      setError("An account with this email already exists.");
      return;
    }

    const user = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    };
    localStorage.setItem("lifeguardUser", JSON.stringify(user));

    // Mark user as logged in
    localStorage.setItem("isLoggedIn", "true");

    // Open Dashboard
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

          {/* Main Content */}
          <div>

            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-6">
              <ShieldCheck
                size={28}
                className="text-cyan-400"
              />
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Join the future of
              <span className="block text-cyan-400 mt-1">
                intelligent healthcare.
              </span>
            </h2>

            <p className="text-slate-400 mt-5 leading-7 max-w-md">
              Create your LifeGuard account and experience connected
              patient monitoring, smart alerts and intelligent healthcare.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2
                  size={18}
                  className="text-cyan-400"
                />
                Real-time health monitoring
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2
                  size={18}
                  className="text-cyan-400"
                />
                Intelligent emergency alerts
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2
                  size={18}
                  className="text-cyan-400"
                />
                Smart gesture recognition
              </div>

            </div>

          </div>

          <p className="text-xs text-slate-500">
            AI-powered patient monitoring & emergency care
          </p>

        </div>


        {/* RIGHT SIDE */}
        <div className="p-7 sm:p-10 lg:p-12">

          {/* Mobile Logo */}
          <Link
            to="/"
            className="lg:hidden flex items-center gap-3 mb-8"
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
          <div className="mb-7">

            <p className="text-cyan-400 text-sm font-semibold mb-2">
              Get started
            </p>

            <h2 className="text-3xl font-bold">
              Create your account
            </h2>

            <p className="text-slate-400 text-sm mt-3">
              Register to access the LifeGuard healthcare platform.
            </p>

          </div>


          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}


          {/* FORM */}
          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >

            {/* Full Name */}
            <div>

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

            </div>


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
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

            </div>


            {/* Role */}
            <div>

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 px-4 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              >
                <option value="Patient">
                  Patient
                </option>

                <option value="Caregiver">
                  Caregiver
                </option>

                <option value="Doctor">
                  Doctor
                </option>
              </select>

            </div>


            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
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


            {/* Confirm Password */}
            <div>

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">

              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) =>
                  setAgree(e.target.checked)
                }
                className="mt-1 w-4 h-4 accent-cyan-500"
              />

              <label
                htmlFor="terms"
                className="text-xs text-slate-500 leading-5 cursor-pointer"
              >
                I agree to the terms and conditions and understand
                that this is a healthcare technology demonstration.
              </label>

            </div>


            {/* Register Button */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 shadow-lg shadow-cyan-500/10 mt-2"
            >
              Create Account

              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

          </form>


          {/* Login Link */}
          <div className="mt-7 text-center">

            <p className="text-sm text-slate-500">
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Login
              </Link>
            </p>

          </div>


          {/* Security */}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-600">

            <ShieldCheck size={15} />

            Secure account registration

          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;