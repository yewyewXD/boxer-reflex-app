"use client";

import AddButton from "@/components/AddButton";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { v4 as uuid } from "uuid";
import Toggle from "@atlaskit/toggle";
import { DEFAULT_ARROWS, DEFAULT_SOUNDS } from "@/constants";

const SettingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [canSave, setCanSave] = useState(false);

  const [showColorPicker, setShowColorPicker] = useState(true);
  const [newColor, setNewColor] = useState("#fff");
  const [newColorName, setNewColorName] = useState("");

  const [colors, setColors] = useState([]);
  const [showAddColor, setShowAddColor] = useState(false);

  const [sounds, setSounds] = useState(DEFAULT_SOUNDS);

  const [arrows, setArrows] = useState(DEFAULT_ARROWS);

  useEffect(() => {
    const storageColors = localStorage.getItem("colors");
    const storageSounds = localStorage.getItem("sounds");
    const storageArrows = localStorage.getItem("arrows");

    if (storageColors) {
      const parsedColors = JSON.parse(storageColors);
      setColors(parsedColors);
    }

    if (storageSounds) {
      const parsedSounds = JSON.parse(storageSounds);
      setSounds(parsedSounds);
    }

    if (storageArrows) {
      const parsed = JSON.parse(storageArrows);
      setArrows(parsed);
    }

    setIsLoading(false);
  }, []);

  function goBack() {
    router.push("/");
  }

  function onSave() {
    setCanSave(false);

    if (colors.length) {
      localStorage.setItem("colors", JSON.stringify(colors));
    }

    if (sounds.some((sound) => sound.isChecked)) {
      localStorage.setItem("sounds", JSON.stringify(sounds));
    }

    localStorage.setItem("arrows", JSON.stringify(arrows));
  }

  function addColor() {
    setShowAddColor(true);
    setCanSave(true);
  }

  function updateColorRate(id, num) {
    setColors((prevColors) => {
      const newColors = [...prevColors];
      const index = newColors.findIndex((color) => color.id === id);
      const newColor = {
        ...newColors[index],
        rate: num,
      };
      newColors[index] = newColor;
      return newColors;
    });
    setCanSave(true);
  }

  function onSaveColor(e) {
    e.preventDefault();
    setColors((prevColors) => {
      const newColors = [
        ...prevColors,
        {
          id: uuid(),
          code: newColor,
          label: newColorName,
        },
      ];
      return newColors;
    });
    setShowAddColor(false);
    setNewColor("#fff");
    setNewColorName("");
    setShowColorPicker(true);
  }

  function onDeleteColor(id) {
    setColors((prevColors) => {
      const newColors = prevColors.filter((color) => color.id !== id);
      return newColors;
    });
  }

  function playSound(id) {
    const audio = new Audio(`/sounds/${id}.mp3`);
    audio.play();
  }

  function toggleSound(id) {
    setSounds((prevSounds) => {
      const newSounds = [...prevSounds];
      const index = newSounds.findIndex((sound) => sound.id === id);
      const newSound = {
        ...newSounds[index],
        isChecked: !newSounds[index].isChecked,
      };
      newSounds[index] = newSound;
      return newSounds;
    });
    setCanSave(true);
  }

  function updateSoundLabel(id, text) {
    setSounds((prevSounds) => {
      const newSounds = [...prevSounds];
      const index = newSounds.findIndex((sound) => sound.id === id);
      const newSound = {
        ...newSounds[index],
        label: text,
      };
      newSounds[index] = newSound;
      return newSounds;
    });
    setCanSave(true);
  }

  function updateSoundRate(id, num) {
    setSounds((prevSounds) => {
      const newSounds = [...prevSounds];
      const index = newSounds.findIndex((sound) => sound.id === id);
      const newSound = {
        ...newSounds[index],
        rate: num,
      };
      newSounds[index] = newSound;
      return newSounds;
    });
    setCanSave(true);
  }

  function updateArrowLabel(id, text) {
    setArrows((prevArrows) => {
      const newArrows = [...prevArrows];
      const index = newArrows.findIndex((arrow) => arrow.id === id);
      const newArrow = {
        ...newArrows[index],
        label: text,
      };
      newArrows[index] = newArrow;
      return newArrows;
    });
    setCanSave(true);
  }

  function updateArrowRate(id, num) {
    setArrows((prevArrows) => {
      const newArrows = [...prevArrows];
      const index = newArrows.findIndex((arrow) => arrow.id === id);
      const newArrow = {
        ...newArrows[index],
        rate: num,
      };
      newArrows[index] = newArrow;
      return newArrows;
    });
    setCanSave(true);
  }

  if (isLoading) return null;

  return (
    <main className="w-full">
      <div className="w-full flex items-center h-16 border-b-2 border-gray-600">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <button onClick={goBack} className="mr-3 hover:opacity-70">
              ⬅️
            </button>
            Settings ⚙️
          </h1>

          <button
            disabled={!canSave}
            className="px-4 py-2 bg-green-400 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed text-sm font-medium"
            onClick={onSave}
          >
            {canSave ? "Save" : "Saved"}
          </button>
        </div>
      </div>

      <div className="text-center font-medium border-b-2 border-gray-600 text-sm py-1 bg-red-100">
        ⚠️Save before you leave!
      </div>

      {/* Colors Section */}
      <div className="border-gray-600 border-b-2">
        <div className="container flex flex-col justify-center py-8 ">
          <div className="text-xl font-semibold text-center mb-4">
            Colors 🔴
          </div>

          {colors.map((color, index) => (
            <div className="mb-4 flex items-center" key={color.id}>
              <span className="font-bold w-6">{index + 1}.</span>
              <div
                style={{ backgroundColor: color.code }}
                onClick={() => alert("Color can't be change once added")}
                className="border-2 border-black w-10 h-5 rounded-md"
              />
              <span className="ml-3 font-medium leading-none">
                {color.label}
              </span>

              <div className="flex-grow flex justify-end items-center text-sm">
                <input
                  value={color.rate}
                  onChange={(e) => updateColorRate(color.id, +e.target.value)}
                  type="text"
                  placeholder="10 - 90"
                  className="border-b border-black w-16 mr-3 outline-none text-center"
                />
                <button
                  onClick={() => onDeleteColor(color.id)}
                  className="border-2 border-gray-600 rounded-md flex justify-center items-center w-6 h-6 text-xs"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}

          {showAddColor && (
            <form className="mb-4 flex items-center" onSubmit={onSaveColor}>
              <span className="font-bold w-6">{colors.length + 1}.</span>

              <div
                onClick={() => setShowColorPicker((bool) => !bool)}
                style={{ backgroundColor: newColor }}
                className="border-2 border-black w-10 h-5 rounded-md relative cursor-pointer"
              >
                {showColorPicker && (
                  <div className="absolute top-8 left-0 z-50">
                    <HexColorPicker
                      onClick={(e) => e.stopPropagation()}
                      color={newColor}
                      onChange={setNewColor}
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                required
                onChange={(e) => setNewColorName(e.target.value)}
                className="ml-3 font-medium w-36 outline-none border-b border-black"
                placeholder="Left kick"
                onFocus={() => setShowColorPicker(false)}
              />
              <div className="flex-grow flex justify-end items-center">
                <button
                  type="submit"
                  className="border-2 border-gray-600 rounded-md flex justify-center items-center px-2 py-1 text-xs bg-green-100"
                >
                  Save
                </button>
              </div>
            </form>
          )}
          <AddButton onClick={addColor} />
        </div>
      </div>

      {/* Sounds Section */}
      <div className="container flex flex-col justify-center py-8 ">
        <div className="text-xl font-semibold text-center mb-4">Sounds 🔊</div>

        <div className="flex flex-col justify-center items-center">
          {sounds.map((sound, index) => (
            <div className="mb-4 flex items-center" key={sound.id}>
              <span className="font-bold w-12">
                {index + 1}.{" "}
                <button onClick={() => playSound(sound.id)}> 🔉</button>
              </span>

              <input
                onChange={(e) => updateSoundLabel(sound.id, e.target.value)}
                value={sound.label}
                type="text"
                className="ml-3 font-medium w-36 outline-none border-b border-black"
                placeholder="Left block"
              />

              <input
                value={sound.rate}
                onChange={(e) => updateSoundRate(sound.id, +e.target.value)}
                type="text"
                placeholder="10 - 90"
                className="border-b border-black w-16 mx-3 text-sm outline-none text-center"
              />

              <Toggle
                isChecked={sound.isChecked}
                onChange={() => toggleSound(sound.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows Section */}
      <div className="border-gray-600 border-b-2" />
      <div className="container flex flex-col justify-center py-8">
        <div className="text-xl font-semibold text-center mb-4">Arrows ➡️</div>

        <div className="flex flex-col justify-center items-center text-sm">
          {arrows.map((arrow, index) => (
            <div className="mb-4 flex items-center" key={arrow.id}>
              <span className="font-bold w-20 mr-1">{arrow.id}</span>

              {/* <input
                onChange={(e) => updateArrowLabel(arrow.id, e.target.value)}
                value={arrow.label}
                type="text"
                className="ml-3 font-medium w-36 outline-none border-b border-black"
                placeholder="Left block"
              /> */}

              <input
                value={arrow.rate}
                onChange={(e) => updateArrowRate(arrow.id, +e.target.value)}
                type="text"
                placeholder="0 - 90"
                className="border-b border-black w-10 mx-3 text-sm outline-none text-center"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center font-medium border-y-2 border-gray-600 text-sm py-1 bg-red-100 mb-8">
        ⚠️Save before you leave!
      </div>
    </main>
  );
};

export default SettingPage;
