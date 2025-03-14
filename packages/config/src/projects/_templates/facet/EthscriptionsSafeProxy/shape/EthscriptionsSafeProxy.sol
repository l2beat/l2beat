// SPDX-License-Identifier: Unknown
pragma solidity 0.8.18;

contract EthscriptionsSafeProxy {
    address internal immutable deployedAddress;

    event ethscriptions_protocol_CreateEthscription(
        address indexed initialOwner,
        string contentURI
    );

    event ethscriptions_protocol_TransferEthscription(
        address indexed recipient,
        bytes32 indexed ethscriptionId
    );

    constructor() {
        deployedAddress = address(this);
    }

    function createEthscription(address to, string calldata dataURI) external {
        require(deployedAddress != address(this), "Only Delegate Call");
        emit ethscriptions_protocol_CreateEthscription(to, dataURI);
    }

    function transferEthscription(address to, bytes32 ethscriptionId) external {
        require(deployedAddress != address(this), "Only Delegate Call");
        emit ethscriptions_protocol_TransferEthscription(to, ethscriptionId);
    }
}