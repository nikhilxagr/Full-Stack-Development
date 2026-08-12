"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async (tokenToVerify: string) => {
    try {
      setLoading(true);
      setError(false);
      await axios.post("/api/users/verifyemail", { token: tokenToVerify });
      setVerified(true);
    } catch (err: any) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = searchParams.get("token") || "";
    setToken(urlToken);
    if (urlToken.length > 0) {
      verifyUserEmail(urlToken);
    }
  }, [searchParams]);

  return (
    <div className="simple-card space-y-4 text-center">
      <h1 className="text-2xl font-bold text-white">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black font-mono text-xs rounded truncate">
        {token ? token : "no token"}
      </h2>

      {loading && <p className="text-xs text-neutral-400">Verifying...</p>}

      {verified && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-green-400">Email Verified</h2>
          <Link href="/login" className="simple-btn block text-sm">
            Login
          </Link>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-lg font-bold text-red-500">Error Verifying Email</h2>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div className="w-full max-w-sm">
        <Suspense fallback={<p className="text-xs text-neutral-400 text-center">Loading...</p>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}