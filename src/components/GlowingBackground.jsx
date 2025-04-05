import React, { useEffect, useState } from "react";

const GlowingBackground = ({ theme }) => {
  const [glows, setGlows] = useState([]);

  useEffect(() => {
    const generateGlows = () => {
      let newGlows = [];
      for (let i = 0; i < 6; i++) {
        newGlows.push({
          id: i,
          top: Math.random() * 100 + "vh",
          left: Math.random() * 100 + "vw",
          size: Math.random() * 100 + 50 + "px",
          duration: Math.random() * 5 + 3 + "s",
        });
      }
      setGlows(newGlows);
    };

    generateGlows();
    const interval = setInterval(generateGlows, 5000);
    return () => clearInterval(interval);
  }, [theme]); // Theme added as dependency, now it updates when theme changes

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {glows.map((glow) => (
        <div
          key={glow.id}
          className={`absolute rounded-full opacity-40 animate-pulse ${
            theme === "dark" ? "bg-blue-500" : "bg-blue-500"
          }`}
          style={{
            top: glow.top,
            left: glow.left,
            width: glow.size,
            height: glow.size,
            filter: "blur(50px)",
            transition: `all ease-in-out ${glow.duration}`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default GlowingBackground;
