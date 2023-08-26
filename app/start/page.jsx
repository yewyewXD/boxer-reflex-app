'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const StartPage = () => {
  const searchParams = useSearchParams();
  const GAME_MIN = +searchParams.get('minute');
  const minInterval = +searchParams.get('min') * 1000;
  const maxInterval = +searchParams.get('max') * 1000;

  const gameDuration = GAME_MIN * 60 * 1000; // 2 minutes in milliseconds
  const gameDurationSeconds = GAME_MIN * 60; // 2 minutes in seconds

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

  const [currentColor, setCurrentColor] = useState('#fff');
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(gameDurationSeconds);

  const minLeft = Math.floor(secondsLeft / 60);
  const secLeft = secondsLeft - minLeft * 60;

  useEffect(() => {
    const storageColors = localStorage.getItem('colors');
    const storageSounds = localStorage.getItem('sounds');
    const storageArrows = localStorage.getItem('arrows');

    if (!storageColors || !storageSounds || !storageArrows) {
      setHasSettingErr(true);
      setIsLoading(false);
      return;
    }

    const arrows = JSON.parse(storageArrows).filter((arrow) => arrow.rate > 0);
    const colorsAndArrows = [...JSON.parse(storageColors), ...arrows];
    const sounds = JSON.parse(storageSounds).filter(
      (sound) => sound.isChecked && sound.rate > 0
    );
    const allElements = [...colorsAndArrows, ...sounds];

    let gameInterval;
    let gameTimeout;
    let consecutiveCount = 0;
    let displayedElement = null;

    const startGame = () => {
      gameInterval = setInterval(() => {
        let newElement = getRandomElement(allElements);

        console.log({ newElement, displayedElement });

        if (newElement?.id === displayedElement?.id) {
          consecutiveCount++;
        } else {
          consecutiveCount = 0;
        }

        if (consecutiveCount > 2) {
          const nonRepeatingElements = allElements.filter(
            (element) => element.id !== newElement.id
          );
          const nonRepeatRandomEl = getRandomElement(nonRepeatingElements);
          newElement = nonRepeatRandomEl;
          displayedElement = { ...nonRepeatRandomEl };
        } else {
          displayedElement = { ...newElement };
        }

        if (colorsAndArrows.some((color) => color.id === newElement.id)) {
          displayColor(newElement);
        } else {
          playSound(newElement);
        }
      }, Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  function getRandomElement(elements) {
    const totalRate = elements.reduce(
      (total, element) => total + element.rate,
      0
    );
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
      setCurrentColor('#fff');
      setCurrentInstruction('');
    }, minInterval - 50);
  }

  function playSound(sound) {
    const audio = new Audio(`/sounds/${sound.id}.mp3`);
    audio.play();
    setCurrentInstruction(`${sound.label} 🔊`);
    setTimeout(() => {
      setCurrentInstruction('');
    }, minInterval - 50);
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
        className="h-screen flex flex-col justify-between w-screen"
        style={{ background: currentColor }}
      >
        <div className="text-lg font-semibold py-2 bg-white text-center">
          Time Left: {minLeft}min {secLeft}s
        </div>

        {currentInstruction && (
          <div className="text-2xl flex-grow flex justify-center items-center text-white font-bold">
            <div className="py-1 px-2 bg-black">{currentInstruction}</div>
          </div>
        )}
      </div>
    </main>
  );
};

export default StartPage;
