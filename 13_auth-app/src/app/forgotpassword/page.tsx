"use client";

import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", { email });
      setSubmitted(true);
      toast.success(response.data?.message || "Reset link sent!");
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="simple-card space-y-5">
          <h1 className="text-2xl font-bold text-center text-white">
            Forgot Password
          </h1>

          {submitted ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-neutral-300">
                If an account exists for <span className="font-semibold text-white">{email}</span>, a password reset link has been sent.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(""); }}
                className="simple-btn-secondary text-xs w-full"
              >
                Send to a different email
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="simple-input text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!email.trim() || loading}
                className="simple-btn text-sm"
              >
                {loading ? "Processing..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="text-center pt-3 border-t border-neutral-800 text-xs text-neutral-400">
            Remember your password?{" "}
            <Link href="/login" className="text-white hover:underline font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
