import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen w-full">
      <div className="container flex justify-center items-center">
        <div className="border-2 border-gray-600 rounded-md p-10 text-xl">
          <Link
            className="block w-full px-6 py-3 hover:opacity-70 bg-green-400 text-center mb-6 rounded-md"
            href="/start"
          >
            Start Now
          </Link>
          <Link
            className="block w-full px-6 py-3 hover:opacity-70 bg-gray-300 text-center rounded-md"
            href="/setting"
          >
            Setting
          </Link>
        </div>
      </div>
    </main>
  );
}
