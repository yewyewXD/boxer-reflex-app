"use client";

import { useRouter } from "next/navigation";
import React from "react";

const SettingPage = () => {
  const router = useRouter();
  function goBack() {
    router.push("/");
  }

  function onSave() {
    console.log("safe");
  }

  return (
    <main className="h-screen w-full">
      <div className="w-full py-6 border-b-2 border-gray-600">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <button onClick={goBack} className="mr-4 hover:opacity-70">
              ⬅️
            </button>
            Settings ⚙️
          </h1>

          <button
            className="px-4 py-2 hover:opacity-70 bg-green-400 rounded-md"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>

      <div className="container flex justify-center items-center py-8">
        <div className="text-xl font-semibold">Colors 🔴</div>
      </div>
    </main>
  );
};

export default SettingPage;
