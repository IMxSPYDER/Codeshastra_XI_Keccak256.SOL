import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import contractABI from '../web3/abi.json';

const contractAddress = '0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61';

const PINATA_API_KEY = '367c1b5c7f0fb67793c3';
const PINATA_SECRET_API_KEY = 'a5d60bb60520c9318d42dd759cde1361527fd98a46a0b5a4a4b4fa5a60d57c07';

const OrganizerRegistration = ({ account }) => {
  const [formData, setFormData] = useState({
    name: '',
    gstNo: '',
    empName: '',
    empId: '',
    designation: '',
    email: '',
    phone: '',
    idDoc: null,
    roleType: '1', // Default to Organization (1), ElectionComm is 2
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
    const data = new FormData();
    data.append('file', file);
    data.append('pinataMetadata', JSON.stringify({ name: file.name }));
    data.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
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
      const idDocHash = await uploadToIPFS(formData.idDoc);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.registerOrganization(
        formData.name,
        formData.gstNo,
        formData.empName,
        formData.empId,
        formData.designation,
        formData.email,
        formData.phone,
        idDocHash,
        parseInt(formData.roleType) // 1 or 2
      );

      await tx.wait();
      alert("✅ Organization registered successfully!");
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
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-xl w-full max-w-2xl h-[90vh] overflow-y-auto border border-gray-700"
      >
        <button
          onClick={() => window.location.reload()}
          className="absolute top-4 right-4 cursor-pointer text-white text-3xl hover:text-red-500"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center mb-8">Organization Registration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Organization Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">GST Number</label>
            <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Employee Name</label>
            <input type="text" name="empName" value={formData.empName} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Employee ID</label>
            <input type="text" name="empId" value={formData.empId} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Role Type</label>
            <select name="roleType" value={formData.roleType} onChange={handleChange} required className="input">
              <option value="1">Organization</option>
              <option value="2">Election Commission</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Upload ID Document (PDF/Image)</label>
            <input type="file" name="idDoc" accept="image/*,application/pdf" onChange={handleChange} required className="file-input" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full py-3 rounded-lg cursor-pointer bg-green-600 hover:bg-green-700 transition font-bold text-lg"
        >
          {loading ? "Registering..." : "Register Organization"}
        </button>
      </form>
    </div>
  );
};

export default OrganizerRegistration;
