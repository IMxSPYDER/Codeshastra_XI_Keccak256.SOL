// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecentralizedIdentity {
    enum Role { USER, INSTITUTION }

    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
        string name;
        string email;
    }

    struct Credential {
        string name;
        string certificateId;
        string dob;
        string certificateName;
        uint256 age;
        string documentIPFSHash;
        bool isVerified;
        bool isRevoked;
    }

    struct AccessRequest {
        address requester;
        string credentialHash;
        bool isApproved;
    }

    mapping(address => User) public users;
    mapping(address => Credential[]) public userCredentials;
    mapping(address => AccessRequest[]) public accessRequests;

    event UserRegistered(address indexed user, string name, string email, Role role);
    event CredentialAdded(address indexed user, string credentialHash);
    event CredentialRequested(address indexed user, address requester, string credentialHash);
    event AccessGranted(address indexed user, address requester, string credentialHash);
    event AccessRevoked(address indexed user, address requester, string credentialHash);
    event CredentialVerified(address indexed user, address verifier, string credentialHash);

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyInstitution() {
        require(users[msg.sender].role == Role.INSTITUTION, "Only institutions allowed");
        _;
    }

    // Function to register a user with name, email, and role
    function registerUser(string memory _name, string memory _email, uint8 _role) public {
        require(!users[msg.sender].isRegistered, "User already registered.");
        require(bytes(_name).length > 0, "Name cannot be empty.");
        require(bytes(_email).length > 0, "Email cannot be empty.");
        require(_role <= uint8(Role.INSTITUTION), "Invalid role.");

        users[msg.sender] = User({
            userAddress: msg.sender,
            role: Role(_role),
            isRegistered: true,
            name: _name,
            email: _email
        });

        emit UserRegistered(msg.sender, _name, _email, Role(_role));
    }

    function getUserRole() public view returns (uint8) {
        require(users[msg.sender].isRegistered, "User not registered!");
        return uint8(users[msg.sender].role);
    }

    function addCredential(
        string memory name,
        string memory certificateId,
        string memory dob,
        string memory certificateName,
        uint256 age,
        string memory documentIPFSHash
    ) public onlyRegistered {
        Credential memory newCredential = Credential({
            name: name,
            certificateId: certificateId,
            dob: dob,
            certificateName: certificateName,
            age: age,
            documentIPFSHash: documentIPFSHash,
            isVerified: false,
            isRevoked: false
        });

        userCredentials[msg.sender].push(newCredential);
        emit CredentialAdded(msg.sender, documentIPFSHash);
    }

    function requestCredential(address user, string memory credentialHash) public onlyInstitution {
        accessRequests[user].push(AccessRequest({
            requester: msg.sender,
            credentialHash: credentialHash,
            isApproved: false
        }));

        emit CredentialRequested(user, msg.sender, credentialHash);
    }

    function grantAccess(address requester, string memory credentialHash, bool zkVerification) public onlyRegistered {
        require(zkVerification, "ZKP verification failed");

        for (uint256 i = 0; i < accessRequests[msg.sender].length; i++) {
            if (accessRequests[msg.sender][i].requester == requester &&
                keccak256(abi.encodePacked(accessRequests[msg.sender][i].credentialHash)) == 
                keccak256(abi.encodePacked(credentialHash))) {
                
                accessRequests[msg.sender][i].isApproved = true;
                emit AccessGranted(msg.sender, requester, credentialHash);
                return;
            }
        }
        revert("Access request not found");
    }

    function revokeAccess(address requester, string memory credentialHash) public onlyRegistered {
        for (uint256 i = 0; i < accessRequests[msg.sender].length; i++) {
            if (accessRequests[msg.sender][i].requester == requester &&
                keccak256(abi.encodePacked(accessRequests[msg.sender][i].credentialHash)) == 
                keccak256(abi.encodePacked(credentialHash))) {
                
                accessRequests[msg.sender][i].isApproved = false;
                emit AccessRevoked(msg.sender, requester, credentialHash);
                return;
            }
        }
        revert("Access request not found");
    }

    function verifyCredential(address user, string memory credentialHash) public onlyInstitution {
        for (uint256 i = 0; i < userCredentials[user].length; i++) {
            if (
                keccak256(abi.encodePacked(userCredentials[user][i].documentIPFSHash)) == 
                keccak256(abi.encodePacked(credentialHash))
            ) {
                userCredentials[user][i].isVerified = true;
                emit CredentialVerified(user, msg.sender, credentialHash);
                return;
            }
        }
        revert("Credential not found");
    }

    function isUserRegistered(address _user) public view returns (bool) {
        return users[_user].isRegistered;
    }

    function getUserDetails(address _user) public view returns (string memory, string memory, uint8, bool) {
        require(users[_user].isRegistered, "User not registered.");
        User memory user = users[_user];
        return (user.name, user.email, uint8(user.role), user.isRegistered);
    }

    function getUserCredentials() public view onlyRegistered returns (Credential[] memory) {
        return userCredentials[msg.sender];
    }

    function getAccessRequests() public view onlyRegistered returns (AccessRequest[] memory) {
        return accessRequests[msg.sender];
    }
}
