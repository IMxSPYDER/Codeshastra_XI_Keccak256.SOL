// src/ChatbotHome.jsx
import React, { useState } from "react";
import { Send } from "lucide-react";
import { sendMessageToGemini } from "./ChatbotService";

export default function ChatbotHome() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 👋 How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to state
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    // Call Gemini API
    const botReply = await sendMessageToGemini(input);
    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    setLoading(false);
  };

  return (
    <div className="w-[350px] mx-auto bg-black/30 backdrop-blur-lg overflow-hidden  h-[75vh] flex flex-col justify-between relative">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#191D37] to-[#3B3F5C] text-white p-5 flex items-center justify-between">
        <span className="text-lg font-bold">Truman</span>
      </div>

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit ${
              msg.sender === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-3 bg-gray-200 text-black rounded-lg self-start">
            Typing...
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t flex">
        <input
          type="text"
          className="w-full p-3 border-1 rounded-l-lg outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r-lg flex items-center"
          onClick={sendMessage}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
