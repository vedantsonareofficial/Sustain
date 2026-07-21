"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "organizer" as "organizer" | "ngo",
    organizationName: "",
    phone: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const metadata: Record<string, string | null> = {
        full_name: formData.fullName,
        role: formData.role,
        contact_phone: formData.phone || null,
        city: formData.city || null,
      };

      if (formData.role === "organizer") {
        metadata.organization_name = formData.organizationName || null;
      } else {
        metadata.ngo_name = formData.organizationName || null;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: metadata },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed.");

      setSuccess(true);
      const dashboard = formData.role === "ngo" ? "/ngo" : "/organizer";
      router.push(authData.session ? dashboard : "/login");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sustain-pattern font-body px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              spa
            </span>
            <span className="text-3xl font-headline font-bold text-primary">Sustain</span>
          </Link>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Create your account</h1>
          <p className="text-on-surface-variant text-sm mt-1">Join the movement. Rescue food. Feed communities.</p>
        </div>

        {/* Card */}
        <div className="glass-morphism rounded-card p-8 card-shadow border border-white/10">
          {success ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <h2 className="text-xl font-headline font-bold text-on-surface mb-2">Account Created!</h2>
              <p className="text-on-surface-variant text-sm">Redirecting to your dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role toggle */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-2">I am joining as</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["organizer", "ngo"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        formData.role === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-outline-variant/30 text-on-surface-variant hover:border-primary/40"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {r === "organizer" ? "restaurant" : "diversity_3"}
                      </span>
                      {r === "organizer" ? "Food Organizer" : "NGO / Partner"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-2" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Priya Sharma"
                  className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-2" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@example.com"
                  className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                />
              </div>

              {/* Organization / NGO & Phone in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2" htmlFor="organizationName">
                    {formData.role === "organizer" ? "Organization Name" : "NGO Name"}
                  </label>
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder={formData.role === "organizer" ? "Green Valley Catering" : "Hope Foundation"}
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2" htmlFor="phone">Phone (Optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-primary mb-2" htmlFor="city">City (Optional)</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-2" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-2" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                />
              </div>

              {/* Error message */}
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
                    <span>Creating Account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>

              <p className="text-center text-sm text-on-surface-variant">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
