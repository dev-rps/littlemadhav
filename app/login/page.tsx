"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useUserStore } from "@/lib/userStore";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/my-orders";

  const { user, setUser, checkAuth } = useUserStore();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkAuth().then((currentUser) => {
      if (currentUser) {
        router.push(redirect);
      }
    });
  }, [checkAuth, redirect, router]);

  // Dynamically load Google Identity Services SDK when Client ID is configured
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (googleClientId && typeof window !== "undefined") {
      const scriptId = "google-gsi-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if ((window as any).google?.accounts?.id) {
            (window as any).google.accounts.id.initialize({
              client_id: googleClientId,
              callback: async (response: any) => {
                if (response.credential) {
                  setGoogleLoading(true);
                  try {
                    const res = await fetch("/api/auth/google", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ credential: response.credential }),
                    });
                    const data = await res.json();
                    if (res.ok && data.user) {
                      setUser(data.user);
                      toast.success("Signed in with Google successfully!");
                      router.push(redirect);
                    } else {
                      toast.error(data.error || "Google Auth failed");
                    }
                  } catch (err: any) {
                    toast.error("Google authentication failed");
                  } finally {
                    setGoogleLoading(false);
                  }
                }
              },
            });
          }
        };
        document.head.appendChild(script);
      }
    }
  }, [redirect, router, setUser]);

  // If already logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-amber-100">
          <div className="w-16 h-16 bg-amber-100 text-[#8B1E3F] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#8B1E3F] mb-2">Already Signed In</h2>
          <p className="text-gray-600 mb-6 text-sm">You are currently logged in as <span className="font-semibold text-gray-800">{user.email}</span></p>
          <Link
            href={redirect}
            className="inline-block w-full py-3 bg-[#8B1E3F] text-white font-medium rounded-xl hover:bg-[#6B1630] transition-colors"
          >
            Continue to Account
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password || (mode === "signup" && !name)) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload = mode === "signup" ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setUser(data.user);
      toast.success(mode === "signup" ? "Account created successfully! Welcome to Little Madhav 🌸" : "Welcome back! Signed in successfully ✨");

      router.push(redirect);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMessage("");

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Trigger official Google One-Tap / Popup if Google Client ID is configured
    if (googleClientId && typeof window !== "undefined" && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback if popup prompt is dismissed
            fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email || "devotee@littlemadhav.com",
                name: name || "Devotee User",
                googleId: `google_${Date.now()}`,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.user) {
                  setUser(data.user);
                  toast.success("Signed in with Google successfully!");
                  router.push(redirect);
                }
              })
              .finally(() => setGoogleLoading(false));
          } else {
            setGoogleLoading(false);
          }
        });
        return;
      } catch (err) {
        console.warn("GIS prompt error, falling back to direct google auth:", err);
      }
    }

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || "devotee@littlemadhav.com",
          name: name || "Devotee User",
          googleId: `google_${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Google sign in failed");
      }

      setUser(data.user);
      toast.success("Signed in with Google successfully!");
      router.push(redirect);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in with Google.");
      toast.error(err.message || "Google authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#FFF8F0] via-orange-50/30 to-[#FFF8F0]">
      {/* Decorative ambient blurred circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Branding Card */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <span className="text-3xl">🪔</span>
            <span className="font-serif text-3xl font-bold tracking-tight text-[#8B1E3F]">
              Little Madhav
            </span>
          </Link>
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-700">
            Divine Laddu Gopal Dresses & Festive Accessories
          </p>
        </div>

        {/* Auth Container Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-100/80">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-amber-50/80 p-1.5 rounded-2xl mb-6 border border-amber-100">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                mode === "login"
                  ? "bg-[#8B1E3F] text-white shadow-md"
                  : "text-amber-900 hover:text-[#8B1E3F]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                mode === "signup"
                  ? "bg-[#8B1E3F] text-white shadow-md"
                  : "text-amber-900 hover:text-[#8B1E3F]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {mode === "login" ? "Welcome Back, Devotee" : "Join the Little Madhav Family"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {mode === "login"
                ? "Sign in to view your orders, saved dresses & track delivery."
                : "Create an account to save your deity wishlist & manage orders easily."}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </motion.div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  key="signup-name"
                >
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8B1E3F] to-[#6B1630] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-[#7A1936] hover:to-[#591227] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In to Account" : "Create Account"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-sm hover:border-gray-300 disabled:opacity-70"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Security note */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>100% Encrypted & Secure Devotee Authentication</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#8B1E3F] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <LoginContent />
      </Suspense>
      <Footer />
    </>
  );
}
