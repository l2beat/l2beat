// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A gate decides whether a caller may go ahead. Which contract stands behind the gate
/// is only known from the deployed state.
interface IGate {
    function authorize(address caller) external;
}

/// Lets nobody through.
contract ClosedGate is IGate {
    function authorize(address) external pure {
        revert("ClosedGate: closed");
    }
}
