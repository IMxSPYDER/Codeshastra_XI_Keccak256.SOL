import { useState, useEffect } from "react"
import { Shield, User, FileText, Share2, Settings, LogOut, Plus, Check, Clock } from "lucide-react"
import { CredentialCard } from "./CredentialCard"
import { RequestCard } from "./RequestCard"
// import { getUserDID, getCredentialRequests } from "../lib/blockchain"
import { Link, useLocation } from "react-router-dom"
import AddCredentialModal from "./AddCredentialModal"
import { ethers } from "ethers"
import contractABI from "../web3/abi.json" // Make sure ABI is here
import UserCredentialsPage from "./UserCredentialsPage"
import RequestedDocuments from "./RequestedDocuments"
import logo from '../assets/top.png'
import { useNavigate } from "react-router-dom"


export default function UserDashboard({ account }) {
  const { state } = useLocation()
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState([])
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("credentials")
  const [activeBigTab, setActiveBigTab] = useState("identity")
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  const contractAddress = "0x6f2eEf81Db6955FDb6e8DFfA741e33924190b3cD"

  const handleModalOpen = () => setIsModalOpen(true)
  const handleModalClose = () => setIsModalOpen(false)

  const handleSignOut = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }]
        });
  
        localStorage.removeItem("walletConnected");
        alert("Wallet disconnected! You will need to reconnect manually.");
  
        navigate("/"); // Redirect to Home Page
      } else {
        alert("MetaMask not detected.");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }

  const approveRequest = async (requestId) => {
    try {
      if (!window.ethereum) throw new Error("No wallet")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
  
      const tx = await contract.approveRequest(requestId)
      await tx.wait()
      await refreshUserData()
    } catch (err) {
      console.error("Error approving request:", err)
    }
  }
  
  const revokeRequest = async (requestId) => {
    try {
      if (!window.ethereum) throw new Error("No wallet")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
  
      const tx = await contract.revokeRequest(requestId)
      await tx.wait()
      await refreshUserData()
    } catch (err) {
      console.error("Error revoking request:", err)
    }
  }

  const refreshUserData = async () => {
    try {
        if (!window.ethereum) return alert("Please install MetaMask");

        setLoading(true);
  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = signer.address;
        setWallet(address);
  
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const data = await contract.getUserCredentials();
        setCredentials(data);
    } catch (err) {
      console.error("Error fetching user data:", err)
    }
  }

  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshUserData()
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchData()
  }, [])
  

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <h2 className="text-xl font-semibold">Loading your secure identity...</h2>
          <p className="text-gray-500">Please wait while we verify your credentials</p>
        </div>
      </div>
    )
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
          <button onClick={() => {setActiveBigTab("credentials")}} to="/user-dashboard/credentials">
            <button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-blue-600 cursor-pointer">
              <FileText className="h-4 w-4" />
              Credentials
            </button>
          </button>
          <button onClick={() => {setActiveBigTab("sharing")}} to="/dashboard/sharing">
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
        <header className="sticky top-0 z-10 bg-midnight backdrop-blur border-b border-b-gray-700">
          <div className="flex h-15 items-center justify-between px-6">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <button className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-blue-600 cursor-pointer">
              <User className="h-4 w-4" />
              {state?.name|| "User"}
            </button>
          </div>
        </header>
        {
          activeBigTab === "identity" && (
            <div className="container mx-auto px-6 py-6">
            {/* Identity Overview */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Your Digital Identity</h2>
              <div className="rounded-xl bg-white/5 backdrop-blur-xs p-4 shadow-sm">
                <h3 className="text-lg font-semibold">Decentralized Identifier (DID)</h3>
                <p className="text-sm text-gray-500">Your unique blockchain identity</p>
                <div className="mt-4 rounded-md bg-white/10 backdrop-blur-xs p-3 font-mono text-sm">
                  {state?.account || "did:blockid:0x1a2b3c4d..."}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Check className="h-4 w-4 text-green-500" />
                  Verified and secured on blockchain
                </div>
              </div>
            </section>
  
            {/* Tabs */}
            <div className="mb-4 pb-2 flex gap-4 border-b border-b-gray-700">
              <button
                className={`p-3 m-1 text-sm font-medium cursor-pointer ${
                  activeTab === "credentials" ? "bg-blue-600 rounded-[5px] text-white" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("credentials")}
              >
                Credentials
              </button>
              <button
                className={`p-3 m-1 text-sm font-medium cursor-pointer ${
                  activeTab === "requests" ? "bg-blue-600 rounded-[5px] text-white" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                Requests
              </button>
            </div>
  
            {/* Tabs Content */}
            {activeTab === "credentials" && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Credentials</h2>
                  <button
                    onClick={handleModalOpen}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add Credential
                  </button>
                </div>
  
                {credentials.length > 0 ? (
                    <UserCredentialsPage/>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border-bg-white/5 bg-white/5 backdrop-blur-xs p-8 text-center shadow-sm">
                    <FileText className="mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium">No Credentials Yet</h3>
                    <p className="mb-4 text-gray-500">Add your first credential to start building your identity.</p>
                    <button
                      onClick={handleModalOpen}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add Your First Credential
                    </button>
                  </div>
                )}
              </section>
            )}
  
            {activeTab === "requests" && (
              <section>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Credential Requests</h2>
                  <p className="text-sm text-gray-500">Organizations requesting access to your credentials</p>
                </div>
  
                {requests.length > 0 ? (
  <div className="space-y-4">
    {requests.map((request) => (
      <RequestCard
        key={request.id}
        request={request}
        onApprove={() => approveRequest(request)}
        onRevoke={() => revokeRequest(request)}
      />
    ))}
  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border-bg-white/5 bg-white/5 backdrop-blur-xs p-8 text-center shadow-sm">
                    <Clock className="mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium">No Pending Requests</h3>
                    <p className="text-gray-500">When organizations request access, you'll see them here.</p>
                  </div>
                )}
              </section>
            )}
          </div>
          )
        }
        {
          activeBigTab === "credentials" && (
            <UserCredentialsPage/>
          )
        }

        {
          activeBigTab === "sharing" && (
            <RequestedDocuments/>
          )
        }
        {
          activeBigTab === "setting" && (
            <div className="container mx-auto px-6 py-6">
              <h2 className="mb-4 text-2xl font-bold">Settings</h2>
              <p className="text-sm text-gray-500">Manage your account settings and preferences.</p>
              {/* Add your settings functionality here */}
            </div>
          )
        }
 
      </main>

      {/* Modal */}
      <AddCredentialModal isOpen={isModalOpen} onClose={handleModalClose} onSuccess={handleModalClose} />
    </div>
  )
}
