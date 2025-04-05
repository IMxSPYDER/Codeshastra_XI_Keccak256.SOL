import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Eye, MoreHorizontal, X } from "lucide-react";
import ABI from "../web3/abi.json";

const CONTRACT_ADDRESS = "0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61";

export default function UserCredentialsPage() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState("");
  const [visibleIds, setVisibleIds] = useState({});
  const [openFile, setOpenFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(false);

  const getIPFSUrl = (hash) => {
    if (hash.startsWith("ipfs://")) {
      const cleanHash = hash.replace("ipfs://", "");
      return `https://gateway.pinata.cloud/ipfs/${cleanHash}`;
    }
    return hash;
  };

  const fetchCredentials = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = signer.address;
      setWallet(address);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const data = await contract.getUserCredentials();
      setCredentials(data);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (index) => {
    setVisibleIds((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleFileOpen = (hash) => {
    setFileError(false);
    setFileLoading(true);
    setOpenFile(hash);
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-4">🎓 Your Blockchain Credentials</h1>
      <p className="text-gray-600 mb-6">
        Wallet: <span className="font-mono">{wallet}</span>
      </p>

      {credentials.length === 0 && !loading && (
        <p className="text-gray-500">No credentials found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-52 rounded-2xl"
              ></div>
            ))
          : credentials.map((cred, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xs rounded-2xl text-white border border-gray-700 shadow-sm p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {cred.certificateName}
                    </h2>
                    <p className="text-sm">Blockchain Credential Authority</p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <p>Issued: 2024-01-01</p>
                  <p>Expires: 2030-12-31</p>
                </div>

                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold">Full Name</span>
                    <span className="font-medium">{cred.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Date of Birth</span>
                    <span className="font-medium">{cred.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Certificate ID</span>
                    <span className="font-medium truncate max-w-[120px]">
                      {visibleIds[index] ? cred.certificateId : "........"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">IPFS Hash</span>
                    <span className="font-medium truncate max-w-[120px]">
                      {cred.documentIPFSHash}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-white"
                    onClick={() => toggleVisibility(index)}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{visibleIds[index] ? "Hide" : "Show"}</span>
                  </div>
                  <MoreHorizontal
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => handleFileOpen(cred.documentIPFSHash)}
                  />
                </div>
              </motion.div>
            ))}
      </div>

      {/* Modal */}
      {openFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 max-w-3xl w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-700"
              onClick={() => {
                setOpenFile(null);
                setFileLoading(false);
                setFileError(false);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold mb-4">Credential File Preview</h2>

            {fileLoading && (
              <p className="text-gray-500 text-center">Loading file...</p>
            )}
            {fileError && (
              <p className="text-red-500 text-center">Failed to load file.</p>
            )}

            <div className="flex justify-center mt-4">
              {openFile.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={getIPFSUrl(openFile)}
                  className="w-full h-[600px] rounded-md"
                  onLoad={() => setFileLoading(false)}
                  onError={() => {
                    setFileLoading(false);
                    setFileError(true);
                  }}
                />
              ) : (
                <img
                  src={getIPFSUrl(openFile)}
                  alt="Credential"
                  className="max-h-[600px] rounded-md mx-auto"
                  onLoad={() => setFileLoading(false)}
                  onError={() => {
                    setFileLoading(false);
                    setFileError(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
