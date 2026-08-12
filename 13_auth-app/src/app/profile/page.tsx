"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  username: string;
  email: string;
  isVerified?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.replace("/login");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || "Logout failed");
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/me");
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="simple-card space-y-5 text-center">
          <h1 className="text-2xl font-bold text-white">Profile Page</h1>

          {data ? (
            <div className="space-y-3 text-left bg-neutral-900 p-4 rounded-lg border border-neutral-800 text-sm">
              <p>
                <span className="text-neutral-400 font-medium">Username:</span>{" "}
                <span className="text-white font-semibold">{data.username}</span>
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Email:</span>{" "}
                <span className="text-white font-semibold">{data.email}</span>
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Status:</span>{" "}
                <span className={data.isVerified ? "text-green-400 font-semibold" : "text-amber-400 font-semibold"}>
                  {data.isVerified ? "Verified" : "Unverified"}
                </span>
              </p>
              <p className="break-all">
                <span className="text-neutral-400 font-medium">User ID:</span>{" "}
                <Link href={`/profile/${data._id}`} className="text-blue-400 hover:underline">
                  {data._id}
                </Link>
              </p>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">
              {loading ? "Loading details..." : "No user details loaded"}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={getUserDetails}
              disabled={loading}
              className="simple-btn-secondary text-sm w-full"
            >
              {loading ? "Loading..." : "Get User Details"}
            </button>
            <button
              onClick={logout}
              className="simple-btn text-sm w-full bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
