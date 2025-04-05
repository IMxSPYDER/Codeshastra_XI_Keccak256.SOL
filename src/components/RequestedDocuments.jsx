import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Check, XCircle } from "lucide-react"
import contractABI from "../web3/abi.json"

export default function RequestedDocuments({ account }) {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const contractAddress = "0x6f2eEf81Db6955FDb6e8DFfA741e33924190b3cD"

  const fetchRequests = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const data = await contract.getCompleteUserData()
      const requestData = data[5].map((r, index) => ({
        id: index,
        requester: r.requester,
        credentialHash: r.credentialHash,
        isApproved: r.isApproved,
      }))
      setRequests(requestData)
    } catch (err) {
      console.error("Error fetching requests:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const grantAccess = async (request) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const zkpVerified = true

      const tx = await contract.grantAccess(
        request.requester,
        request.credentialHash,
        zkpVerified
      )
      await tx.wait()
      alert("Access Granted Successfully with ZKP")
      fetchRequests()
    } catch (err) {
      console.error("Grant Access Error:", err)
    }
  }

  const revokeAccess = async (request) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.revokeAccess(
        request.requester,
        request.credentialHash
      )
      await tx.wait()
      alert("Access Revoked")
      fetchRequests()
    } catch (err) {
      console.error("Revoke Access Error:", err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (isLoading) {
    return <div className="p-6">Loading Requested Documents...</div>
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="mb-4 text-2xl font-bold">Requested Documents</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No document requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between bg-white/5 backdrop-blur-xs p-4 rounded-xl shadow-sm"
            >
              <div>
                <p className="text-sm text-gray-400">Requester:</p>
                <p className="font-medium">{request.requester}</p>
                <p className="text-xs text-gray-500 mt-1">Credential Hash:</p>
                <p className="text-xs font-mono">{request.credentialHash}</p>
              </div>
              <div className="flex items-center gap-3">
                {request.isApproved ? (
                  <>
                    <span className="flex items-center gap-1 text-green-500 text-sm">
                      <Check className="h-4 w-4" /> Access Granted
                    </span>
                    <button
                      onClick={() => revokeAccess(request)}
                      className="px-3 py-1 text-sm bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Revoke Access
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-red-500 text-sm">
                      <XCircle className="h-4 w-4" /> Access Not Granted
                    </span>
                    <button
                      onClick={() => grantAccess(request)}
                      className="px-3 py-1 text-sm bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Grant Access
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
