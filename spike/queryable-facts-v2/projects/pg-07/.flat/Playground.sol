// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A relay asks a gate on behalf of whoever it is told about.
interface IRelay {
    function check(address who) external;
}

contract Playground {
    uint256 public score;
    IRelay public relay;

    constructor(IRelay _relay) {
        relay = _relay;
    }

    function setScore(uint256 next) external {
        relay.check(msg.sender);
        score = next;
    }
}
