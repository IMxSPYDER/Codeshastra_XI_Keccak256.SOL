import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/top.png";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { ThemeContext } from "../Context/ThemeContext";

export default function Footer() {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  return (
    <div className={` ${theme === "dark" ? " !border-b-gray-700 border-t-1 text-white" : " !border-b-gray-50 border-t-1 text-black"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="0xETHDao Logo" width={35} height={40} />
            <span className={`font-bold text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}>
              Vote<span className={`text-blue-500 ${theme === "dark" ? "text-blue-300" : "text-blue-500"}`}>Sphere</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="#" className="text-sm text-white transition-colors">
              About
            </Link>
            <Link to="#" className="text-sm text-white transition-colors">
              Membership
            </Link>
            <Link to="#" className="text-sm text-white transition-colors">
              Team
            </Link>
            <Link to="#" className="text-sm text-white transition-colors">
              Products
            </Link>
            <Link to="#" className="text-sm text-white transition-colors">
              Partners
            </Link>
          </nav>
          <div className="flex items-center gap-4">
          <Link
              to="#"
              className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
            >
              <Facebook className={`${theme === "dark" ? "text-white" : "text-black"} w-4 h-4`} />
            </Link>
            <Link
              to="#"
              className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
            >
              <Twitter className={`${theme === "dark" ? "text-white" : "text-black"} w-4 h-4`} />
            </Link>
            <Link
              to="#"
              className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
            >
              <Instagram className={`${theme === "dark" ? "text-white" : "text-black"} w-4 h-4`} />
            </Link>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8">© 2025 Keccak256.Sol All Rights Reserved.</div>
      </div>
    </div>
  );
}