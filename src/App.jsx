import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import RegisterForm from "./components/RegisterForm"; // Import the new form component

// import RegisterPopup from "./components/RegisterPopup";
import contractABI from './web3/abi.json'
// import Home from './Home'
import BenefitCard from './components/BenefitCard'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import BenefitsSection from './components/BenefitCard'
import './app.css'
import Contact from './components/Contact';
import ChatbotHome from './components/chatbot/ChatbotHome';
import ChatbotMessages from './components/chatbot/ChatbotMessages';
import Chatbot from './components/chatbot/Chatbot';
import GlowingBackground from "./components/GlowingBackground";
import EcosystemComponent from "./components/EcosystemComponent";
import { ThemeContext } from "./Context/ThemeContext";
import RoleSelector from "./components/RoleSelector";
import OrganizerRegistration from "./components/OrganizerRegistration";
import VoterRegistration from "./components/VoterRegistration";
const App = () => {
  const [account, setAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const [role, setRole] = useState(null); // 'organizer' or 'voter'
  const [showRoleSelector, setShowRoleSelector] = useState(false);


  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); 
  const contractAddress = '0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61'; // Replace with actual contract address


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        }).then(() =>
          window.ethereum.request({ method: 'eth_accounts' })
        );
        setAccount(accounts[0]); 
        checkUserRegistration(accounts[0]); // Check if the user is already registered
        setShowRoleSelector(true);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert('MetaMask not detected. Please install it.');
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        // Revoke permission to access wallet (forces user to reconnect)
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }]
        });
  
        setAccount(null);
        localStorage.removeItem("walletConnected"); // Remove stored wallet session
  
        alert("Wallet disconnected! You will need to reconnect manually.");
  
        window.location.reload(); // Refresh page to reset state
      } else {
        alert("MetaMask not detected.");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const checkUserRegistration = async (walletAddress) => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const registered = await contract.isUserRegistered(walletAddress);
      setIsRegistered(registered);
    } catch (error) {
      console.error("Error checking user registration:", error);
    }
  };
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme in localStorage
  };

  return (
    <div>
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <GlowingBackground theme={theme} />

      <div className={`min-h-screen ${theme === "dark" ? "text-white" : "text-black"}`}>
        <Navbar account={account} connectWallet={connectWallet} disconnectWallet={disconnectWallet} theme={theme} toggleTheme={toggleTheme} />

        {account ? (
        console.log(account),
        <>
            {/* Show Role Selector if not chosen yet */}
            {showRoleSelector && !role && (
              <RoleSelector onSelect={(selectedRole) => {
                setRole(selectedRole);
                setShowRoleSelector(false);
              }} />
            )}

            {/* Show registration page based on role */}
            {role === 'organizer' && <OrganizerRegistration account={account} />}
            {role === 'voter' && <VoterRegistration account={account} />}
          </>
        ) : (
          <>
            <Landing theme={theme} />
            <BenefitsSection theme={theme} />
            <EcosystemComponent theme={theme} />
            <Contact theme={theme} />
            <Chatbot theme={theme} />
            <Footer theme={theme} />
          </>
        )}
      </div>
      
    </ThemeContext.Provider>
    </div>
  );
};

export default App;
