// ElectionList.jsx
import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { ethers } from "ethers";
import contractABI from "../web3/abi.json";

const contractAddress = "0xa9783Ef7f13A8A2cbaDD3e9a7457dC2c0189FD61";

export default function ElectionList({ organizer }) {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchElections = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const all = await contract.getOrganizerElections(); // Make sure this exists
      setElections(all);
    } catch (err) {
      console.error("Error fetching elections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading elections...</p>;
  }

  if (!elections.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 p-6 text-center">
        <Calendar className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-300">No elections yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {elections.map((election, index) => (
        <div key={index} className="rounded-md bg-white/5 p-4 border border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold">{election.title}</h3>
          <p className="text-gray-400 text-sm">{election.description}</p>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            {election.location}
            <Calendar className="h-4 w-4 ml-4" />
            {election.date}
          </div>
        </div>
      ))}
    </div>
  );
}
