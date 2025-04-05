import React from "react";

export default function Contact({theme}) {
  return (
    <div className="h-full flex flex-col m-20 text-white" id="contact">
      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-6">
          <h1 className= {`${
                  theme === "dark" ? "text-white" : "text-black"
                } text-3xl font-bold md:text-5xl `}>
            Get in touch for a customised solution
          </h1>
          <p className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-700"
                }    text-sm  `}>
            Get instant access for a free trial — no credit card, no risk
          </p>

          {/* Subscribe Form */}
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-2 md:mx-auto md:max-w-md">
            <input
              type="email" 
              placeholder="Enter your mail"
              className="w-full flex-1 rounded-md border border-gray-600 px-4 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-600 focus:outline-none"
            />
            <button className="whitespace-nowrap rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent">
              Subscribe
            </button>
          </div>
        </div>
      </main>


    </div>
  );
}
