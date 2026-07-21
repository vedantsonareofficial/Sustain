"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Redirect based on role stored in user metadata
      const role = data.user?.user_metadata?.role;
      if (role === "ngo") {
        router.push("/ngo");
      } else {
        router.push("/organizer");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sustain-pattern font-body px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              spa
            </span>
            <span className="text-3xl font-headline font-bold text-primary">Sustain</span>
          </Link>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Welcome back</h1>
          <p className="text-on-surface-variant text-sm mt-1">Sign in to continue rescuing surplus food.</p>
        </div>

        {/* Card */}
        <div className="glass-morphism rounded-card p-8 card-shadow border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-primary mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-[20px]">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@example.com"
                  className="w-full p-4 pl-12 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-primary" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="w-full p-4 pl-12 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl border border-error/20">
                <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-btn text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95 elevation-high cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                  <span>Signing In…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </form>
        </div>

        {/* Demo credentials hint */}
        <p className="text-center text-xs text-on-surface-variant/50 mt-6">
          New to Sustain?{" "}
          <Link href="/signup" className="text-primary/70 hover:text-primary hover:underline">
            Create a free account
          </Link>{" "}
          and start rescuing food today.
        </p>
      </div>
    </div>
  );
}
