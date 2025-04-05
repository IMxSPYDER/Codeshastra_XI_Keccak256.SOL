import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import contractABI from '../web3/abi.json';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase.js'; // Firebase config module

const contractAddress = '0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61';

const VoterRegistration = ({ account }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    govId: null,
    phone: '',
    email: '',
    locationHash: '',
  });

  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const uploadGovIdToIPFS = async (file) => {
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);
    pinataFormData.append('pinataMetadata', JSON.stringify({ name: file.name }));
    pinataFormData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', pinataFormData, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: '367c1b5c7f0fb67793c3',
        pinata_secret_api_key: 'a5d60bb60520c9318d42dd759cde1361527fd98a46a0b5a4a4b4fa5a60d57c07',
      }
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const captureAndUploadPhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await (await fetch(imageSrc)).blob();

    const photoRef = ref(storage, `voter_photos/${formData.email || Date.now()}.jpg`);
    await uploadBytes(photoRef, blob);
    const downloadURL = await getDownloadURL(photoRef);

    const img = await faceapi.bufferToImage(blob);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detection) throw new Error("Face not detected");

    return {
      photoUrl: downloadURL,
      faceVector: Array.from(detection.descriptor)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { photoUrl, faceVector } = await captureAndUploadPhoto();
      const govIdHash = await uploadGovIdToIPFS(formData.govId);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.registerVoter(
        formData.fullName,
        formData.dob,
        formData.gender,
        photoUrl, // stored on Firebase
        govIdHash, // stored on IPFS
        formData.phone,
        formData.email,
        ethers.encodeBytes32String(formData.locationHash)
      );

      await tx.wait();
      alert("✅ Voter registered successfully!");

      // (Optional) Save faceVector to Firebase/Firestore for login matching
      console.log("Face vector:", faceVector);

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
          className="absolute top-4 right-4 cursor-pointer text-white text-3xl hover:text-red-500 focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center mb-8">Voter Registration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Date of Birth</label>
            <input type="text" name="dob" value={formData.dob} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Gender</label>
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input" />
          </div>

          <div>
            <label className="block text-sm mb-1">Location (hashed)</label>
            <input type="text" name="locationHash" value={formData.locationHash} onChange={handleChange} required className="input" />
          </div>

          {/* Webcam Photo */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Capture Photo</label>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-xl border border-gray-600 w-full h-[300px] object-cover"
            />
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
