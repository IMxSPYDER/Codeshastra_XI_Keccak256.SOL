// AddElectionModal.jsx
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { ethers } from "ethers";
import contractABI from "../web3/abi.json";

const contractAddress = "0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61";

export default function AddElectionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!window.ethereum) return alert("MetaMask not found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.createElection(
        formData.title,
        formData.description,
        formData.location,
        formData.date
      );

      await tx.wait();
      alert("Election created successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to create election:", err);
      alert("Error creating election.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-midnight p-6 shadow-lg text-white border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">Create New Election</Dialog.Title>
            <button onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full rounded-md border border-gray-600 bg-transparent p-2 text-sm"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full rounded-md border border-gray-600 bg-transparent p-2 text-sm"
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full rounded-md border border-gray-600 bg-transparent p-2 text-sm"
            />
            <input
              name="date"
              value={formData.date}
              onChange={handleChange}
              type="date"
              className="w-full rounded-md border border-gray-600 bg-transparent p-2 text-sm"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md text-sm text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Election"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
