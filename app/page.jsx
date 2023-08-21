import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="container flex justify-center items-center">
        <div className="border-2 border-gray-600 rounded-md p-10 text-xl">
          <Link
            className="block w-full px-6 py-3 bg-green-400 text-center mb-6 rounded-md"
            href="/start"
          >
            Start Now
          </Link>
          <Link
            className="block w-full px-6 py-3 bg-gray-300 text-center rounded-md"
            href="/settings"
          >
            Settings
          </Link>
        </div>
      </div>
    </main>
  );
}
