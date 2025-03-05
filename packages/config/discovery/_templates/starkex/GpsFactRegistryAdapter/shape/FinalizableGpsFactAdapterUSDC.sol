// SPDX-License-Identifier: Unknown
pragma solidity 0.6.12;

abstract contract SimpleAdminable {
    address owner;
    address ownerCandidate;
    mapping(address => bool) admins;

    constructor() internal {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    // Admin/Owner Modifiers.
    modifier onlyOwner() {
        require(isOwner(msg.sender), "ONLY_OWNER");
        _;
    }

    function isOwner(address testedAddress) public view returns (bool) {
        return owner == testedAddress;
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "ONLY_ADMIN");
        _;
    }

    function isAdmin(address testedAddress) public view returns (bool) {
        return admins[testedAddress];
    }

    function registerAdmin(address newAdmin) external onlyOwner {
        if (!isAdmin(newAdmin)) {
            admins[newAdmin] = true;
        }
    }

    function removeAdmin(address removedAdmin) external onlyOwner {
        require(!isOwner(removedAdmin), "OWNER_CANNOT_BE_REMOVED_AS_ADMIN");
        delete admins[removedAdmin];
    }

    function nominateNewOwner(address newOwner) external onlyOwner {
        require(!isOwner(newOwner), "ALREADY_OWNER");
        ownerCandidate = newOwner;
    }

    function acceptOwnership() external {
        // Previous owner is still an admin.
        require(msg.sender == ownerCandidate, "NOT_A_CANDIDATE");
        owner = ownerCandidate;
        admins[ownerCandidate] = true;
        ownerCandidate = address(0x0);
    }
}

abstract contract Finalizable is SimpleAdminable {
    event Finalized();

    bool finalized;

    function isFinalized() public view returns (bool) {
        return finalized;
    }

    modifier notFinalized() {
        require(!isFinalized(), "FINALIZED");
        _;
    }

    function finalize() external onlyAdmin notFinalized {
        finalized = true;
        emit Finalized();
    }
}

interface IFactRegistry {
    /*
      Returns true if the given fact was previously registered in the contract.
    */
    function isValid(bytes32 fact) external view returns (bool);
}

interface IQueryableFactRegistry is IFactRegistry {
    /*
      Returns true if at least one fact has been registered.
    */
    function hasRegisteredFact() external view returns (bool);
}

interface Identity {
    /*
      Allows a caller to ensure that the provided address is of the expected type and version.
    */
    function identify() external pure returns (string memory);
}

contract GpsFactRegistryAdapter is IQueryableFactRegistry, Identity {
    IQueryableFactRegistry public gpsContract;
    uint256 public programHash;

    constructor(IQueryableFactRegistry gpsStatementContract, uint256 programHash_) public {
        gpsContract = gpsStatementContract;
        programHash = programHash_;
    }

    function identify() external pure virtual override returns (string memory) {
        return "StarkWare_GpsFactRegistryAdapter_2020_1";
    }

    /*
      Checks if a fact has been verified.
    */
    function isValid(bytes32 fact) external view override returns (bool) {
        return gpsContract.isValid(keccak256(abi.encode(programHash, fact)));
    }

    /*
      Indicates whether at least one fact was registered.
    */
    function hasRegisteredFact() external view override returns (bool) {
        return gpsContract.hasRegisteredFact();
    }
}

contract FinalizableGpsFactAdapter is GpsFactRegistryAdapter, Finalizable {
    constructor(IQueryableFactRegistry gpsStatementContract, uint256 programHash_)
        public
        GpsFactRegistryAdapter(gpsStatementContract, programHash_)
    {}

    function setProgramHash(uint256 newProgramHash) external notFinalized onlyAdmin {
        programHash = newProgramHash;
    }

    function identify() external pure override returns (string memory) {
        return "StarkWare_FinalizableGpsFactAdapter_2022_1";
    }
}