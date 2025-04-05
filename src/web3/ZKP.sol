// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @custom:dev-run-script ./scripts/deploy.js

interface IZKPVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) external view returns (bool);
}

contract ZKVotePlatform {
    address public admin;
    IZKPVerifier public verifier;

    enum VotingType { Approval, Ranked, Quadratic }
    enum Role { None, Voter, Organization, ElectionComm }

    struct Voter {
        string fullName;
        string dob;
        string gender;
        string photoHash; // IPFS
        string govIdHash; // IPFS
        string phone;
        string email;
        bytes32 locationHash;
        bool isVerified; // After biometric + 2FA
    }

    struct Organization {
        string name;
        string gstNo;
        string empName;
        string empId;
        string designation;
        string email;
        string phone;
        string idDocHash; // IPFS
        Role roleType;
        bool registered;
    }

    struct Candidate {
        string name;
        uint age;
        string partyOrDesignation;
        string logoHash; // IPFS (optional)
        uint voteCount;
    }

    struct Election {
        string title;
        string description;
        VotingType votingType;
        bytes32 locationHash;
        uint startTime;
        uint endTime;
        bool isActive;
        address createdBy;

        uint[] candidateIds;
        mapping(uint => Candidate) candidates;
        mapping(bytes32 => bool) hasVoted; // ZK nullifier
    }

    mapping(address => Role) public userRoles;
    mapping(address => Voter) public voters;
    mapping(address => Organization) public organizations;
    mapping(uint => Election) public elections;

    uint public electionCount;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier onlyVerifiedVoter() {
        require(userRoles[msg.sender] == Role.Voter, "Not a voter");
        require(voters[msg.sender].isVerified, "Not verified");
        _;
    }

    modifier onlyOrganization() {
        require(
            userRoles[msg.sender] == Role.Organization || userRoles[msg.sender] == Role.ElectionComm,
            "Not authorized org"
        );
        _;
    }

    constructor(address _verifier) {
        admin = msg.sender;
        verifier = IZKPVerifier(_verifier);
    }

    // --- REGISTRATION ---

    function registerVoter(
        string memory fullName,
        string memory dob,
        string memory gender,
        string memory photoHash,
        string memory govIdHash,
        string memory phone,
        string memory email,
        bytes32 locationHash
    ) external {
        voters[msg.sender] = Voter(fullName, dob, gender, photoHash, govIdHash, phone, email, locationHash, false);
        userRoles[msg.sender] = Role.Voter;
    }

    function verifyVoter(address voterAddr) external onlyAdmin {
        voters[voterAddr].isVerified = true;
    }

    function registerOrganization(
        string memory name,
        string memory gstNo,
        string memory empName,
        string memory empId,
        string memory designation,
        string memory email,
        string memory phone,
        string memory idDocHash,
        Role roleType // Organization or ElectionComm
    ) external {
        require(roleType != Role.None && roleType != Role.Voter, "Invalid role type");
        organizations[msg.sender] = Organization(name, gstNo, empName, empId, designation, email, phone, idDocHash, roleType, true);
        userRoles[msg.sender] = roleType;
    }

    // --- ELECTION CREATION ---

    function createElection(
        string memory title,
        string memory description,
        VotingType votingType,
        bytes32 locationHash,
        uint startTime,
        uint endTime,
        string[] memory candidateNames,
        uint[] memory ages,
        string[] memory designations,
        string[] memory logoHashes
    ) external onlyOrganization returns (uint) {
        require(candidateNames.length == ages.length && ages.length == designations.length, "Data mismatch");

        uint electionId = electionCount++;
        Election storage e = elections[electionId];
        e.title = title;
        e.description = description;
        e.votingType = votingType;
        e.locationHash = locationHash;
        e.startTime = startTime;
        e.endTime = endTime;
        e.isActive = true;
        e.createdBy = msg.sender;

        for (uint i = 0; i < candidateNames.length; i++) {
            uint cid = e.candidateIds.length;
            e.candidates[cid] = Candidate(candidateNames[i], ages[i], designations[i], logoHashes[i], 0);
            e.candidateIds.push(cid);
        }

        return electionId;
    }

    // --- VOTING ---

    function vote(
        uint electionId,
        uint[] memory selectedCandidates,
        bytes32 nullifierHash,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) external onlyVerifiedVoter {
        Election storage e = elections[electionId];
        require(e.isActive, "Election closed");
        require(block.timestamp >= e.startTime && block.timestamp <= e.endTime, "Out of voting window");
        require(!e.hasVoted[nullifierHash], "Already voted");
        require(verifier.verifyProof(a, b, c, input), "Invalid ZKP");

        // Geo-validation
        require(voters[msg.sender].locationHash == e.locationHash, "Not in allowed location");

        for (uint i = 0; i < selectedCandidates.length; i++) {
            uint cid = selectedCandidates[i];
            e.candidates[cid].voteCount += 1;
        }

        e.hasVoted[nullifierHash] = true;
    }

    function getCandidates(uint electionId) external view returns (Candidate[] memory) {
        Election storage e = elections[electionId];
        Candidate[] memory list = new Candidate[](e.candidateIds.length);
        for (uint i = 0; i < list.length; i++) {
            list[i] = e.candidates[i];
        }
        return list;
    }

    function endElection(uint electionId) external onlyOrganization {
        require(elections[electionId].createdBy == msg.sender, "Not campaign owner");
        elections[electionId].isActive = false;
    }
}
