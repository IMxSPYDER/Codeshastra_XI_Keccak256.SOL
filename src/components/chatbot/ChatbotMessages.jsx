import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ChatbotMessages() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const questions = [
    { question: "How to reset my password?", answer: "Go to settings > Account > Reset Password." },
    { question: "How do I contact support?", answer: "You can email us at support@example.com." },
    { question: "What features are available?", answer: "Our chatbot supports FAQs, messaging, and live chat." },
  ];

  return (
    <div className="w-[350px] mx-auto bg-black/30 backdrop-blur-lg overflow-hidden border h-[75vh] flex flex-col z-50 relative">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#191D37] to-[#3B3F5C] text-white p-5 text-center font-bold z-50 relative">
        Messages
      </div>

      {/* FAQ Section */}
      <div className="p-4 z-50 relative">
        <h2 className="font-semibold text-lg mb-3">Popular Questions</h2>
        <div className="space-y-3">
          {questions.map((item, index) => (
            <div key={index} className="border p-3 rounded-lg bg-transparent">
              <button
                onClick={() => toggleDropdown(index)}
                className="w-full flex cursor-pointer justify-between items-center text-left font-medium"
              >
                {item.question}
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openIndex === index && <p className="mt-2 text-gray-200">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
