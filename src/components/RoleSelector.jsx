import React from 'react';
import { FaUserShield, FaVoteYea } from 'react-icons/fa';

const RoleSelector = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2f] p-6 rounded-2xl shadow-2xl w-full max-w-3xl text-white relative border border-gray-700">
      <div className='border border-dashed rounded-lg border-grey-300 p-5'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-dashed rounded border-grey-300">
          {/* Organizer Role */}
          <div
            className="cursor-pointer bg-[#2a2a40] hover:bg-[#343454] p-6 rounded-xl transition"
            onClick={() => onSelect('organizer')}
          >
            <div className="flex flex-col items-center justify-center">
              <FaUserShield size={40} className="text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Organizer</h3>
              <p className="text-sm text-gray-300 text-center">
                Create elections, register candidates, and manage voting events.
              </p>
            </div>
          </div>

          {/* Voter Role */}
          <div
            className="cursor-pointer bg-[#2a2a40] hover:bg-[#343454] p-6 rounded-xl transition"
            onClick={() => onSelect('voter')}
          >
            <div className="flex flex-col items-center justify-center">
              <FaVoteYea size={40} className="text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Voter</h3>
              <p className="text-sm text-gray-300 text-center">
                Participate in elections anonymously and securely using ZK proofs.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 p-4 bg-[#262638] text-sm text-blue-300 border border-blue-500 rounded-lg">
          <p className="mb-1 font-semibold text-blue-400">Important Notes:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-300">
            <li>Organizers must be verified and registered with proper documents.</li>
            <li>Voters will only be allowed to vote once verified with biometrics and 2FA.</li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RoleSelector;
