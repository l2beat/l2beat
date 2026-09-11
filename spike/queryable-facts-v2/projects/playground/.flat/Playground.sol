// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A gate decides whether a caller may go ahead. Which contract stands behind the gate
/// is only known from the deployed state.
interface IGate {
    function authorize(address caller) external;
}

contract Playground {
    address public owner;
    address public guardian;
    uint256 public score;
    IGate public gate;

    constructor(address _owner, address _guardian, IGate _gate) {
        owner = _owner;
        guardian = _guardian;
        gate = _gate;
    }

    function setScore(uint256 next) external {
        gate.authorize(msg.sender);
        score = next;
    }
}
