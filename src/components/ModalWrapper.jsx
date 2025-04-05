// components/ModalWrapper.js
import React from 'react';

const ModalWrapper = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl p-6 bg-[#1a1a1a] text-white rounded-2xl shadow-lg animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
