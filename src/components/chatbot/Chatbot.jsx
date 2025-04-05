import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaEnvelope, FaCommentDots, FaTimes } from "react-icons/fa";
import ChatbotHome from "./ChatbotHome";
import Messages from "./ChatbotMessages";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <ChatbotHome />;
      case "messages":
        return <Messages />;
      default:
        return <ChatbotHome />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex  flex-col items-end z-50">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className=" w-full h-3/4  border-2 overflow-hidden border-gray-200  rounded-xl shadow-lg "
        >

          <div className="flex-1 overflow-auto">{renderPage()}</div>
          <div className="flex bg-white justify-around p-4 border-t-gray-200 border-t-2">
            <button
              className={`flex flex-col cursor-pointer items-center ${activePage === "home" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setActivePage("home")}
            >
              <FaHome size={20} />
              <span className="text-xs">Home</span>
            </button>
            <button
              className={`flex flex-col cursor-pointer items-center ${activePage === "messages" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setActivePage("messages")}
            >
              <FaEnvelope size={20} />
              <span className="text-xs">Messages</span>
            </button>
          </div>
        </motion.div>
      )}
      <button
        onClick={toggleChatbot}
        className=" mt-2 bg-blue-500 cursor-pointer text-white rounded-full p-4 shadow-lg"
      >
        {isOpen ? <FaTimes size={24} /> : <FaCommentDots size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
