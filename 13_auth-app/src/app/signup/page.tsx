"use client";
import { useEffect } from "react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);


  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup response:", response.data);
      toast.success("Signup successful!");
      router.push("/login");
       
    } catch (error: any) {
      console.log("Signup error:", error.message);
        toast.error(error.message || "An error occurred during signup");
    }finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Signing Up..." : "Sign Up"}</h1>
      <hr />
      <label htmlFor="username">Username</label>
      <input
        className="border border-gray-300 rounded-md p-2 mb-4"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="Enter your username"
      />

      <label htmlFor="email">Email</label>
      <input
        className="border border-gray-300 rounded-md p-2 mb-4"
        id="email"
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Enter your email"
      />

      <label htmlFor="password">Password</label>
      <input
        className="border border-gray-300 rounded-md p-2 mb-4"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Enter your password"
      />

      <button
        className="bg-blue-500 text-white rounded-md p-2 mb-4"
        onClick={onSignup}
      >
        {buttonDisabled ? "Please fill all fields" : "Sign Up"}
      </button>
      <Link href="/login" className="text-blue-500">
        Already have an account? Log in
      </Link>
    </div>
  );
}