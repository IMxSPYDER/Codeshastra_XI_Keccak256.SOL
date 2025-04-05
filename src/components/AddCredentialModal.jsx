import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, UploadCloud, Loader2 } from "lucide-react"
import { ethers } from "ethers"
import axios from "axios"
import CONTRACT_ABI from "../web3/abi.json"

const CONTRACT_ADDRESS = "0x6f2eEf81Db6955FDb6e8DFfA741e33924190b3cD"

// ❗️ In production, move these API keys to server-side functions
const PINATA_API_KEY = "c12515a4241830355897"
const PINATA_SECRET_API_KEY = "eb37b14066883896cea2f4eeba9dc73f6b79364a900b1332763a9d98375a9c9e"

export default function AddCredentialModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    certificateId: "",
    dob: "",
    certificateName: "",
    age: "",
  })
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const uploadToIPFS = async (file) => {
    try {
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
      const formData = new FormData()
      formData.append("file", file)

      const res = await axios.post(url, formData, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      })

      return `ipfs://${res.data.IpfsHash}`
    } catch (err) {
      console.error("IPFS Upload Error:", err)
      throw err
    }
  }

  const addCredentialOnChain = async ({
    name,
    certificateId,
    dob,
    certificateName,
    age,
    documentIPFSHash,
  }) => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected")

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      const tx = await contract.addCredential(
        name,
        certificateId,
        dob,
        certificateName,
        age,
        documentIPFSHash
      )

      await tx.wait()
      return { success: true, txHash: tx.hash }
    } catch (error) {
      console.error("Blockchain Error:", error)
      return { success: false, error: error.message }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return alert("Please upload a document.")

    try {
      setIsUploading(true)

      const ipfsHash = await uploadToIPFS(file)

      const result = await addCredentialOnChain({
        ...form,
        age: parseInt(form.age),
        documentIPFSHash: ipfsHash,
      })

      if (result.success) {
        alert("✅ Credential Added Successfully!")
        onSuccess()
        onClose()
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-lg rounded-2xl bg-midnight p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Credential</h2>
              <button className="cursor-pointer" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full rounded-lg bg-white/10 p-2 text-sm focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  className="rounded-lg bg-white/10 p-2 text-sm focus:outline-none"
                />
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  className="rounded-lg bg-white/10 p-2 text-sm focus:outline-none"
                />
                
              
              <input
                type="text"
                name="certificateName"
                value={form.certificateName}
                onChange={handleChange}
                placeholder="Certificate Name"
                required
                className="w-full rounded-lg bg-white/10 p-2 text-sm focus:outline-none"
              />
              <input
                  type="text"
                  name="certificateId"
                  value={form.certificateId}
                  onChange={handleChange}
                  placeholder="Certificate ID"
                  required
                  className="rounded-lg bg-white/10 p-2 text-sm focus:outline-none"
                />
              
                
                </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 p-2 text-sm">
                <UploadCloud className="h-4 w-4" />
                {file ? file.name : "Upload Document (PDF/Image)"}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full rounded-lg cursor-pointer bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "Add Credential"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
