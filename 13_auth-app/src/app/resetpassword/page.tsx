"use client";

import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get("token") || "";
    setToken(urlToken);
  }, [searchParams]);

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = token && newPassword.length >= 6 && passwordsMatch && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);
      await axios.post("/api/users/resetpassword", { token, newPassword });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to reset password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-red-400">No reset token found in URL.</p>
        <Link href="/forgotpassword" className="text-xs text-white underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-green-400 font-medium">Password reset successfully!</p>
        <Link href="/login" className="simple-btn block text-sm">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="newPassword" className="block text-xs font-medium text-neutral-300 mb-1">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (min 6 characters)"
          className="simple-input text-sm"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-medium text-neutral-300 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="simple-input text-sm"
        />
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="simple-btn text-sm"
      >
        {loading ? "Processing..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="simple-card space-y-5">
          <h1 className="text-2xl font-bold text-center text-white">
            Reset Password
          </h1>

          <Suspense fallback={<p className="text-xs text-neutral-400 text-center">Loading...</p>}>
            <ResetPasswordContent />
          </Suspense>

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
