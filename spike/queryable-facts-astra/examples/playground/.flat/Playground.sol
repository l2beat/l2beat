// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

interface IGate {
    function authorize(address caller) external view;
}

contract Playground {
    uint256 public score;
    IGate public immutable gate;

    constructor(IGate initialGate) { gate = initialGate; }

    function setScore(uint256 next) external {
        gate.authorize(msg.sender);
        score = next;
    }
}

