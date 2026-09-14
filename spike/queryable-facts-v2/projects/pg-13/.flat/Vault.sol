// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A sentinel decides who may act; it reverts for everyone else.
interface ISentinel {
    function permit(address who) external view;
}

contract Vault {
    address public keeper;
    uint256 public level;
    ISentinel public sentinel;
    bool public halted;

    constructor(address _keeper, ISentinel _sentinel) {
        keeper = _keeper;
        sentinel = _sentinel;
    }

    function bump(uint256 by) external {
        if (!halted) {
            if (address(sentinel) != address(0)) {
                sentinel.permit(msg.sender);
            } else {
                revert("Vault: no sentinel");
            }
        } else {
            revert("Vault: halted");
        }
        level = by;
    }
}
