// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

contract Playground {
    address public immutable owner;
    uint256 public score;

    constructor(address initialOwner) {
        owner = initialOwner;
    }

    function setScore(uint256 next) external {
        require(msg.sender == owner, "Only owner");
        score = next;
    }

    function readScore() external view returns (uint256) {
        return score;
    }
}
