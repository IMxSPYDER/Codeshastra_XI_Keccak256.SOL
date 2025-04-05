import { useState, useEffect } from "react";
import {
  User, FileText, Share2, Settings, LogOut, Plus, Check, Clock
} from "lucide-react";
import { ethers } from "ethers";
import { useLocation, useNavigate } from "react-router-dom";
import contractABI from "../web3/abi.json";
import logo from "../assets/top.png";

// Components (you can separate these)
import AddElectionModal from "./AddElectionModal"; // Create this component like AddCredentialModal
import ElectionList from "./ElectionList"; // Shows organizer's elections

const contractAddress = "0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61";

export default function OrganizerDashboard({ account }) {
  const { state } = useLocation();
  const [activeBigTab, setActiveBigTab] = useState("identity");
  const [activeTab, setActiveTab] = useState("elections");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleSignOut = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        localStorage.removeItem("walletConnected");
        navigate("/");
      } else {
        alert("MetaMask not detected.");
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer =  provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // const role = await contract.userRoles(account);
        // if (role !== 1n && role !== 2n) {
        //   alert("You are not authorized to access the Organizer Dashboard.");
        //   navigate("/");
        //   return;
        // }

        // const org = await contract.organizations(account);
        // setOrgData(org);
      } catch (err) {
        console.error("Failed to load organizer data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgData();
  }, [account]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <h2 className="text-xl font-semibold">Loading Organizer Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-screen h-[100vh]">
      {/* Sidebar */}

      <aside className="hidden w-64 flex-col bg-midnight border-r-gray-700 border-r-1 pb-2 z-50 md:flex">
              <div className="flex items-center border-b-1 border-b-gray-700 gap-2 font-bold p-4 text-lg">
                <img src={logo} className="h-5 w-5"/>
                <span>TruChain</span>
              </div>
              <nav className="mt-3 flex flex-col gap-1 p-3">
                <button onClick={() => {setActiveBigTab("identity")}} to="/user-dashboard">
                  <button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-blue-600 cursor-pointer">
                    <User className="h-4 w-4" />
                    Identity
                  </button>
                </button>
                <button onClick={() => {setActiveBigTab("elections")}} to="/user-dashboard/credentials">
                  <button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-blue-600 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Credentials
                  </button>
                </button>
                <button onClick={() => {setActiveBigTab("requests")}} to="/dashboard/sharing">
                  <button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-blue-600 cursor-pointer">
                    <Share2 className="h-4 w-4" />
                    Sharing
                  </button>
                </button>
                <button onClick={() => {setActiveBigTab("setting")}} to="/dashboard/settings">
                  <button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-blue-600 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </button>
              </nav>
              <div className="mt-auto p-3">
                <button
                onClick={handleSignOut}
                 className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-blue-600 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-midnight border-b border-b-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">Organizer Dashboard</h1>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              {state?.name || "Organizer"}
            </div>
          </div>
        </header>

        {/* Big Tab: Identity */}
        {activeBigTab === "identity" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Organization Profile</h2>
            <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
              {/* <p><strong>Name:</strong> {orgData.name}</p>
              <p><strong>Email:</strong> {orgData.email}</p>
              <p><strong>Phone:</strong> {orgData.phone}</p>
              <p><strong>GST:</strong> {orgData.gstNo}</p>
              <p><strong>Role:</strong> {orgData.roleType == 1n ? "Organization" : "Election Commission"}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
                <Check className="h-4 w-4" />
                Verified on Blockchain
              </div> */}
            </div>
          </div>
        )}

        {/* Big Tab: Elections */}
        {activeBigTab === "elections" && (
          <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Elections</h2>
              <button
                onClick={handleModalOpen}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Create Election
              </button>
            </div>

            {/* Your ElectionList Component */}
            <ElectionList organizer={account} />
          </div>
        )}

        {/* Big Tab: Requests (if applicable) */}
        {activeBigTab === "requests" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Requests from Users</h2>
            <div className="text-gray-400">
              No request data implemented yet.
            </div>
          </div>
        )}

        {/* Big Tab: Settings */}
        {activeBigTab === "settings" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-400">Manage your organizer preferences here.</p>
          </div>
        )}
      </main>

      <AddElectionModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
