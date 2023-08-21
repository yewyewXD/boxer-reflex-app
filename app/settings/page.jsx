"use client";

import AddButton from "@/components/AddButton";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { v4 as uuid } from "uuid";

const SettingPage = () => {
  const router = useRouter();
  const [showColorPicker, setShowColorPicker] = useState(true);
  const [newColor, setNewColor] = useState("#fff");
  const [newColorName, setNewColorName] = useState("");

  const [colors, setColors] = useState([
    {
      id: "x",
      code: "#fff",
      name: "Left kick",
    },
  ]);
  const [showAddColor, setShowAddColor] = useState(false);

  const [sounds, setSounds] = useState([]);
  const [showAddSound, setShowAddSound] = useState(false);

  function goBack() {
    router.push("/");
  }

  function onSave() {
    console.log("safe");
  }

  function addColor() {
    setShowAddColor(true);
  }

  function addSound() {}

  function onSaveColor(e) {
    e.preventDefault();
    setColors((prevColors) => {
      const newColors = [
        ...prevColors,
        {
          id: uuid(),
          code: newColor,
          name: newColorName,
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

  return (
    <main className="h-screen w-full">
      <div className="w-full flex items-center h-16 border-b-2 border-gray-600">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <button onClick={goBack} className="mr-3 hover:opacity-70">
              ⬅️
            </button>
            Settings ⚙️
          </h1>

          <button
            className="px-4 py-2 bg-green-400 rounded-md"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>

      {/* Colors Section */}
      <div className="border-gray-600 border-b-2">
        <div className="container flex flex-col justify-center py-8 ">
          <div className="text-xl font-semibold mb-4 text-center">
            Colors 🔴
          </div>
          {colors.map((color, index) => (
            <div className="mb-4 flex items-center" key={color.id}>
              <span className="text-lg font-bold w-6">{index + 1}.</span>
              <div
                style={{ backgroundColor: color.code }}
                className="border-2 border-black w-10 h-5 rounded-md"
              />
              <span className="ml-3 font-medium">{color.name}</span>
              <div className="flex-grow flex justify-end items-center">
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
              <span className="text-lg font-bold w-6">
                {colors.length + 1}.
              </span>

              <div
                onClick={() => setShowColorPicker((bool) => !bool)}
                style={{ backgroundColor: newColor }}
                className="border-2 border-black w-10 h-5 rounded-md relative cursor-pointer"
              >
                {showColorPicker && (
                  <div className="absolute top-8 left-0">
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
                className="ml-3 font-medium w-40 outline-none border-b border-black"
                placeholder="Left kick"
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
      <div className="container flex flex-col justify-center items-center py-8">
        <div className="text-xl font-semibold mb-4">Sounds 🔊</div>
        <AddButton onClick={addSound} />
      </div>
    </main>
  );
};

export default SettingPage;
