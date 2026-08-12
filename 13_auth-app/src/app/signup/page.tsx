"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (buttonDisabled || loading) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      toast.success(response.data?.message || "Signup successful!");
      router.push("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Signup failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.username.trim().length > 0 &&
      user.email.trim().length > 0 &&
      user.password.trim().length >= 6
    ) {
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
            {loading ? "Processing..." : "Signup"}
          </h1>

          <form onSubmit={onSignup} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-neutral-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="username"
                className="simple-input text-sm"
              />
            </div>

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

            <button
              type="submit"
              disabled={buttonDisabled || loading}
              className="simple-btn text-sm"
            >
              {buttonDisabled ? "No signup" : loading ? "Processing..." : "Signup"}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-neutral-800 text-xs text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline font-medium">
              Visit Login page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
