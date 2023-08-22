"use client";

import Link from "next/link";
import { useState } from "react";
import Slider from "react-rangeslider";

export default function Home() {
  const [gameMinute, setGameMinute] = useState(2);

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="container flex justify-center items-center">
        <div className="border-2 border-gray-600 rounded-md p-10 text-xl">
          <div>Duration: {gameMinute} min</div>
          <Slider
            min={1}
            max={5}
            value={gameMinute}
            onChange={(value) => setGameMinute(value)}
          />

          <Link
            className="block w-full px-6 py-3 bg-green-400 text-center mb-6 rounded-md"
            href={`/start?minute=${gameMinute}`}
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
