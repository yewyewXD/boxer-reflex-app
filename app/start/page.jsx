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

  const [displayedElement, setDisplayedElement] = useState(null);
  const [currentColor, setCurrentColor] = useState("#fff");
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [gameDuration] = useState(0.5 * 60 * 1000); // 0.5 minutes in milliseconds
  const [intervalRange] = useState([500, 2000]); // Random interval range in milliseconds

  useEffect(() => {
    const storageColors = localStorage.getItem("colors");
    const storageSounds = localStorage.getItem("sounds");

    if (!storageColors || !storageSounds) {
      setHasSettingErr(true);
      setIsLoading(false);
      return;
    }

    const colors = JSON.parse(storageColors);
    const sounds = JSON.parse(storageSounds).filter((sound) => sound.isChecked);

    // Calculate total rates for both colors and sounds
    const totalColorRate = colors.reduce(
      (total, color) => total + color.rate,
      0
    );
    const totalSoundRate = sounds.reduce(
      (total, sound) => total + sound.rate,
      0
    );

    let gameInterval;
    let gameTimeout;
    const startGame = () => {
      let lastDisplayedElement = null;
      gameInterval = setInterval(() => {
        const isColor =
          Math.random() < totalColorRate / (totalColorRate + totalSoundRate);

        let newElement;
        if (isColor) {
          newElement = getRandomElement(colors, totalColorRate);
        } else {
          newElement = getRandomElement(sounds, totalSoundRate);
        }

        while (
          newElement === lastDisplayedElement ||
          newElement === displayedElement
        ) {
          newElement = isColor
            ? getRandomElement(colors, totalColorRate)
            : getRandomElement(sounds, totalSoundRate);
        }

        setDisplayedElement(newElement);
        lastDisplayedElement = newElement;

        if (newElement) {
          if (isColor) {
            displayColor(newElement);
          } else {
            playSound(newElement);
          }
        }
      }, Math.floor(Math.random() * (intervalRange[1] - intervalRange[0] + 1)) + intervalRange[0]);

      gameTimeout = setTimeout(() => {
        clearInterval(gameInterval);
      }, gameDuration);
    };

    setIsLoading(false);

    if (gameStarted) {
      startGame();
    }

    return () => {
      clearInterval(gameInterval);
      clearInterval(gameTimeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  function getRandomElement(elements, totalRate) {
    const randomNumber = Math.random() * totalRate;
    let cumulativeRate = 0;

    for (const element of elements) {
      cumulativeRate += element.rate;
      if (randomNumber <= cumulativeRate) {
        return element;
      }
    }
  }

  function displayColor(color) {
    setCurrentColor(color.code);
    setCurrentInstruction(color.label);

    setTimeout(() => {
      setCurrentColor("#fff");
    }, 400);
  }

  function playSound(sound) {
    const audio = new Audio(`/sounds/${sound.id}.mp3`);
    audio.play();
    setCurrentInstruction(sound.label);
  }

  function onFinishCountdown() {
    setGameStarted(true);
  }

  if (isLoading) return null;

  if (hasSettingErr) {
    return (
      <main>
        <div className="container h-screen flex justify-center items-center">
          <div className="text-3xl font-bold text-center">
            Please configure your settings first.
          </div>
        </div>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main>
        <div className="container h-screen flex justify-center items-center">
          {!gameStarted && (
            <div className="text-6xl font-bold">{countDown}</div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main>
      <div
        className="container h-screen"
        style={{ backgroundColor: currentColor }}
      >
        <div className="text-2xl font-semibold py-4 bg-white text-center">
          {currentInstruction}
        </div>
      </div>
    </main>
  );
};

export default StartPage;
