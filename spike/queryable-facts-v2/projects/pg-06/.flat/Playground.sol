// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A gate decides whether a caller may go ahead. Which contract stands behind the gate
/// is only known from the deployed state.
interface IGate {
    function authorize(address caller) external;
}

contract Playground {
    uint256 public score;
    IGate[] public gates;

    constructor(IGate[] memory _gates) {
        gates = _gates;
    }

    function setScore(uint256 next) external {
        for (uint256 i = 0; i < gates.length; i++) {
            gates[i].authorize(msg.sender);
        }
        score = next;
    }
}
