"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (buttonDisabled || loading) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      toast.success(response.data?.message || "Login successful!");
      router.replace("/profile");
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.trim().length > 0 && user.password.trim().length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="simple-card space-y-5">
          <h1 className="text-2xl font-bold text-center text-white">
            {loading ? "Processing..." : "Login"}
          </h1>

          <form onSubmit={onLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-neutral-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="email"
                className="simple-input text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
                className="simple-input text-sm"
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgotpassword"
                className="text-xs text-neutral-400 hover:text-white hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={buttonDisabled || loading}
              className="simple-btn text-sm"
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-neutral-800 text-xs text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline font-medium">
              Visit Signup page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
