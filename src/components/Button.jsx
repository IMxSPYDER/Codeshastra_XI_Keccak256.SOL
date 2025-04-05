import React from "react";

const Button = (text) => {
  return (
    <div>
      <button onClick={text.click} className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition cursor-pointer shadow-cyan-500/50">
        {text.text}
      </button>
    </div>
  );
};

export default Button;
