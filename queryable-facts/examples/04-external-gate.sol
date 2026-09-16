// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

interface IGate {
    function authorize(address caller) external view;
}

contract Playground {
    IGate public immutable gate;
    uint256 public score;

    constructor(IGate initialGate) {
        gate = initialGate;
    }

    function setScore(uint256 next) external {
        gate.authorize(msg.sender);
        score = next;
    }
}
