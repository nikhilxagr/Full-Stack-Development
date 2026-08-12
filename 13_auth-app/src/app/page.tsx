import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-white">Next.js Auth App</h1>
        <p className="text-neutral-400 text-sm">
          A fullstack authentication application built with Next.js, MongoDB, JWT cookies, and Nodemailer.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/login"
            className="simple-btn text-center text-sm"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="simple-btn-secondary text-center text-sm w-full"
          >
            Signup
          </Link>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-center gap-4 text-xs text-neutral-400">
          <Link href="/profile" className="hover:text-white underline">
            Profile Dashboard
          </Link>
          <Link href="/forgotpassword" className="hover:text-white underline">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}