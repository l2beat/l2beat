// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A sentinel decides who may act; it reverts for everyone else.
interface ISentinel {
    function permit(address who) external view;
}

/// Lets exactly one address through: its warden.
contract Sentinel is ISentinel {
    address public warden;

    constructor(address _warden) {
        warden = _warden;
    }

    function permit(address who) external view {
        if (who != warden) {
            revert("Sentinel: not the warden");
        }
    }
}
