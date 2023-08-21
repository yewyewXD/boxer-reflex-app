"use client";

import React, { useEffect, useState } from "react";

const StartPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSettingErr, setHasSettingErr] = useState(false);

  const [countDown, setCountDown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDown > 1) {
        setCountDown(countDown - 1);
      } else {
        clearInterval(interval);
        onFinishCountdown();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  useEffect(() => {
    const colors = JSON.parse(localStorage.getItem("colors") ?? "");
    const sounds = JSON.parse(localStorage.getItem("sounds") ?? "");

    if (!colors && !sounds) {
      setHasSettingErr(true);
      setIsLoading(false);
    }
  }, []);

  function onFinishCountdown() {
    setGameStarted(true);
  }

  if (isLoading) return null;

  if (hasSettingErr) {
    return (
      <main>
        <div className="container h-screen flex justify-center items-center">
          <div className="text-3xl font-bold">
            Please configure your settings first.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container h-screen flex justify-center items-center">
        {!gameStarted && <div className="text-6xl font-bold">{countDown}</div>}

        {gameStarted && <div className="text-3xl font-bold">game started!</div>}
      </div>
    </main>
  );
};

export default StartPage;
