"use client";

import React, { useEffect, useState } from "react";

const GAME_MIN = 2;
const gameDuration = GAME_MIN * 60 * 1000; // 2 minutes in milliseconds
const gameDurationSeconds = GAME_MIN * 60; // 2 minutes in milliseconds
const minInterval = 300;
const maxInterval = 2000;
const intervalRange = [minInterval, maxInterval]; // Random interval range in milliseconds

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
  const [secondsLeft, setSecondsLeft] = useState(gameDurationSeconds);

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

  // Game count down
  useEffect(() => {
    if (!gameStarted) return;

    const gameCountdown = setInterval(() => {
      setSecondsLeft((sec) => sec - 1);
    }, 1000);

    const gameTimeout = setTimeout(() => {
      clearInterval(gameCountdown);
    }, gameDuration);

    return () => {
      clearInterval(gameCountdown);
      clearInterval(gameTimeout);
    };
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
    }, minInterval - 50);
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
        <div className="h-screen flex justify-center items-center">
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
        className="container h-screen flex flex-col justify-between"
        style={{ backgroundColor: currentColor }}
      >
        <div className="text-lg font-semibold py-2 bg-white text-center">
          {currentInstruction}
        </div>

        <div className="text-lg font-semibold py-2 bg-white text-center">
          Time Left: {secondsLeft}s
        </div>
      </div>
    </main>
  );
};

export default StartPage;
