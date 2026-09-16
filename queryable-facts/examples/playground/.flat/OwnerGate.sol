// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

contract OwnerGate {
    address public immutable owner;

    constructor(address initialOwner) { owner = initialOwner; }

    function authorize(address caller) external view {
        require(caller == owner, "Not owner");
    }
}
