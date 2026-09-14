// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A gate decides whether a caller may go ahead. Which contract stands behind the gate
/// is only known from the deployed state.
interface IGate {
    function authorize(address caller) external;
}

/// A relay asks a gate on behalf of whoever it is told about.
interface IRelay {
    function check(address who) external;
}

/// Passes the question on to its gate. Its own msg.sender is the contract that asked.
contract Relay is IRelay {
    IGate public gate;

    constructor(IGate _gate) {
        gate = _gate;
    }

    function check(address who) external {
        gate.authorize(who);
    }
}
