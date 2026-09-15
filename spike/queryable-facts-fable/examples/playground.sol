// SPDX-License-Identifier: MIT
// The playground: one variable, `Playground.score`, and the question "how can it change?".
//
// setScore is the only function that writes score, and it asks a gate first. Which gate is
// deployed behind `gate` is not in this file: that is a fact about the deployed state (level 6).
// The other functions are decoys: they read score, or write other variables, or belong to other
// contracts. A tool that lists setScore alone has narrowed the reading to one function.
pragma solidity 0.8.20;

/// A gate decides whether a caller may go ahead.
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

    /// The only place that writes score. The gate decides who gets here.
    function setScore(uint256 next) external {
        gate.authorize(msg.sender);
        score = next;
    }

    /// Reads score, writes nothing.
    function doubled() external view returns (uint256) {
        return score * 2;
    }

    /// Writes a different variable: a decoy for "who writes score".
    function setGuardian(address next) external {
        require(msg.sender == owner, "not the owner");
        guardian = next;
    }
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

/// Lets nobody through.
contract ClosedGate is IGate {
    function authorize(address) external pure {
        revert("ClosedGate: closed");
    }
}
