// SPDX-License-Identifier: Unknown
pragma solidity 0.6.12;

interface Identity {
    /*
      Allows a caller, typically another contract,
      to ensure that the provided address is of the expected type and version.
    */
    function identify() external pure returns (string memory);
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