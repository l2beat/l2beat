// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

contract Playground {
    uint256 public score;

    function setScore(uint256 next) external {
        revert("This call always fails");
        score = next;
    }

    function readScore() external view returns (uint256) {
        return score;
    }
}
