export default function UserProfile({params}:any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">Welcome to your profile {params.id} page!</p>
      <span className="bg-gray-200 text-gray-800 p-2 rounded ml-2">This is the user profile page.</span>
    </div>
  );
}