import React from "react";

const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-3xl w-full flex justify-center items-center rounded-md border-2 border-gray-600  md:py-1 bg-gray-200"
    >
      +
    </button>
  );
};

export default AddButton;
