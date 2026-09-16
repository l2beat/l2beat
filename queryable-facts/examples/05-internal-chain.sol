// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

contract Playground {
    uint256 public score;
    address public immutable owner;

    constructor(address initialOwner) {
        owner = initialOwner;
    }

    function updateScore(uint256 next) external {
        checkAndSetScore(next);
    }

    function checkAndSetScore(uint256 next) internal {
        require(msg.sender == owner, "Not owner");
        setScore(next);
    }

    function setScore(uint256 next) internal {
        score = next;
    }
}
