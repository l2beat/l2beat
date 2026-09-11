// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A gate decides whether a caller may go ahead. Which contract stands behind the gate
/// is only known from the deployed state.
interface IGate {
    function authorize(address caller) external;
}

/// Lets exactly one address through: its owner.
contract OwnerGate is IGate {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function authorize(address caller) external view {
        require(caller == owner, "OwnerGate: not the owner");
    }
}
