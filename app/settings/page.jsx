"use client";

import AddButton from "@/components/AddButton";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { v4 as uuid } from "uuid";
import Toggle from "@atlaskit/toggle";
import Slider from "react-rangeslider";

const SettingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [canSave, setCanSave] = useState(false);

  const [showColorPicker, setShowColorPicker] = useState(true);
  const [newColor, setNewColor] = useState("#fff");
  const [newColorName, setNewColorName] = useState("");

  const [colorRate, setColorRate] = useState(50);
  const [colors, setColors] = useState([]);
  const [showAddColor, setShowAddColor] = useState(false);

  const [soundRate, setSoundRate] = useState(50);
  const [sounds, setSounds] = useState([
    {
      id: "s1",
      label: "",
      isChecked: false,
    },
    {
      id: "s3",
      label: "",
      isChecked: false,
    },
    {
      id: "s4",
      label: "",
      isChecked: false,
    },
    {
      id: "s5",
      label: "",
      isChecked: false,
    },
    {
      id: "s6",
      label: "",
      isChecked: false,
    },
    {
      id: "s7",
      label: "",
      isChecked: false,
    },
    {
      id: "s8",
      label: "",
      isChecked: false,
    },
    {
      id: "s9",
      label: "",
      isChecked: false,
    },
    {
      id: "s10",
      label: "",
      isChecked: false,
    },
  ]);

  useEffect(() => {
    const storageColors = localStorage.getItem("colors");
    const storageSounds = localStorage.getItem("sounds");

    if (storageColors) {
      const parsedColors = JSON.parse(storageColors);
      setColors(parsedColors);
      setColorRate(parsedColors[0].rate);
    }

    if (storageSounds) {
      const parsedSounds = JSON.parse(storageSounds);
      setSounds(parsedSounds);
      setSoundRate(parsedSounds[0].rate);
    }

    setIsLoading(false);
  }, []);

  function goBack() {
    router.push("/");
  }

  function onSave() {
    setCanSave(false);

    if (colors.length) {
      localStorage.setItem(
        "colors",
        JSON.stringify(colors.map((color) => ({ ...color, rate: colorRate })))
      );
    }

    if (sounds.some((sound) => sound.isChecked)) {
      localStorage.setItem(
        "sounds",
        JSON.stringify(sounds.map((sound) => ({ ...sound, rate: soundRate })))
      );
    }
  }

  function addColor() {
    setShowAddColor(true);
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
          <div className="text-xl font-semibold text-center">Colors 🔴</div>
          <div className="mb-4">
            <Slider
              min={0}
              max={100}
              value={colorRate}
              onChange={(value) => {
                setColorRate(value);
                if (!canSave) {
                  setCanSave(true);
                }
              }}
            />
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
                  type="number"
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
      <div className="container flex flex-col justify-center py-8">
        <div className="text-xl font-semibold text-center">Sounds 🔊</div>
        <div className="mb-4">
          <Slider
            min={0}
            max={100}
            value={soundRate}
            onChange={(value) => {
              setSoundRate(value);
              if (!canSave) {
                setCanSave(true);
              }
            }}
          />
        </div>

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
                className="ml-3 font-medium w-40 outline-none border-b border-black"
                placeholder="Left block"
              />

              <Toggle
                isChecked={sound.isChecked}
                onChange={() => toggleSound(sound.id)}
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
