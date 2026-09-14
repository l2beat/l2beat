// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A gate decides whether a caller may go ahead. Which contract stands behind the gate
/// is only known from the deployed state.
interface IGate {
    function authorize(address caller) external;
}

contract Playground {
    address public owner;
    uint256 public score;
    IGate public gate;
    bool public checked;

    constructor(address _owner, IGate _gate) {
        owner = _owner;
        gate = _gate;
        checked = true;
    }

    /// Only the owner decides whether the gate is consulted at all.
    function setChecked(bool next) external {
        require(msg.sender == owner, "Playground: not the owner");
        checked = next;
    }

    function setScore(uint256 next) external {
        if (checked) {
            gate.authorize(msg.sender);
        }
        score = next;
    }
}
