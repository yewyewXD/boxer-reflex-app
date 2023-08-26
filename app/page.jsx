'use client';

import Link from 'next/link';
import { useState } from 'react';
import Slider from 'react-rangeslider';

export default function Home() {
  const [gameMinute, setGameMinute] = useState(2);
  const [minInterval, setMinInterval] = useState('0.5');
  const [maxInterval, setMaxInterval] = useState('2');

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="container flex justify-center items-center">
        <div className="border-2 border-gray-600 rounded-md p-10">
          <div>Duration: {gameMinute} min</div>
          <Slider
            min={1}
            max={5}
            value={gameMinute}
            onChange={(value) => setGameMinute(value)}
          />

          <div className="my-5">
            <div>Intervals:</div>
            <div className="flex">
              <input
                type="text"
                className="border border-black w-16 text-center"
                value={minInterval}
                onChange={(e) => setMinInterval(e.target.value)}
              />
              to
              <input
                type="text"
                className="border border-black w-16 text-center"
                value={maxInterval}
                onChange={(e) => setMaxInterval(e.target.value)}
              />
              seconds
            </div>
          </div>

          <Link
            className="block w-full px-6 py-3 bg-green-400 text-center mb-6 rounded-md"
            href={`/start?minute=${gameMinute}&min=${minInterval}&max=${maxInterval}`}
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
