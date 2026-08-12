import Link from "next/link";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="simple-card space-y-4 text-center">
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
          <p className="text-sm text-neutral-400">
            Profile ID: <span className="p-1 px-2 rounded bg-orange-500 text-black font-mono font-bold text-xs">{id}</span>
          </p>
          <div className="pt-2 border-t border-neutral-800">
            <Link href="/profile" className="text-xs text-neutral-400 hover:text-white underline">
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
