import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import contractABI from '../web3/abi.json';
// import 'react-router-dom';
import { useNavigate } from 'react-router-dom';




const contractAddress = '0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61';

// Pinata keys (replace with env vars in prod)
const PINATA_API_KEY = '367c1b5c7f0fb67793c3';
const PINATA_SECRET_API_KEY = 'a5d60bb60520c9318d42dd759cde1361527fd98a46a0b5a4a4b4fa5a60d57c07';

const VoterRegistration = ({ account }) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    photo: null,
    govId: null,
    phone: '',
    email: '',
    locationHash: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({ name: file.name }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      }
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const photoHash = await uploadToIPFS(formData.photo);
      const govIdHash = await uploadToIPFS(formData.govId);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.registerVoter(
        formData.fullName,
        formData.dob,
        formData.gender,
        photoHash,
        govIdHash,
        formData.phone,
        formData.email,
        ethers.encodeBytes32String(formData.locationHash)
      );

      await tx.wait();
      alert("✅ Voter registered successfully!");
      navigate('/user-dashboard');
    } catch (error) {
      console.error(error);
      alert("❌ Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-opacity-70 z-50 p-4">
        
      <form 
        onSubmit={handleSubmit}
        className="relative  bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-xl w-full max-w-2xl h-[90vh] overflow-y-auto border border-gray-700"
      >
        <button
    onClick={() => window.location.reload()} // or your custom close handler
    className="absolute top-4 right-4 cursor-pointer text-white text-3xl hover:text-red-500 focus:outline-none"
    aria-label="Close"
  >
    &times;
  </button>
        <h2 className="text-3xl font-bold text-center mb-8">Voter Registration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input" />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm mb-1">Date of Birth</label>
            <input type="text" name="dob" value={formData.dob} onChange={handleChange} required className="input" />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} required className="input" />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input" />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm mb-1">Location (hashed)</label>
            <input type="text" name="locationHash" value={formData.locationHash} onChange={handleChange} required className="input" />
          </div>

          {/* Photo Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Upload Photo</label>
            <input type="file" name="photo" accept="image/*" onChange={handleChange} required className="file-input" />
          </div>

          {/* Gov ID Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Upload Government ID (PDF/Image)</label>
            <input type="file" name="govId" accept="image/*,application/pdf" onChange={handleChange} required className="file-input" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full py-3 rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 transition font-bold text-lg"
        >
          {loading ? "Uploading..." : "Register Now"}
        </button>
      </form>
    </div>
  );
};

export default VoterRegistration;
