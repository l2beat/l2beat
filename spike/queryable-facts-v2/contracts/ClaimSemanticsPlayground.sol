// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract ClaimSemanticsPlayground {
    address public owner;
    address public guardian;
    bool public open;
    uint256 public value;

    constructor(address _owner, address _guardian) {
        owner = _owner;
        guardian = _guardian;
    }

    function unguardedWrite(uint256 next) external {
        value = next;
    }

    function ownerWrite(uint256 next) external {
        require(msg.sender == owner, "not owner");
        value = next;
    }

    function conditionalGuard(bool enforce, uint256 next) external {
        if (enforce) {
            require(msg.sender == owner, "not owner");
        }
        value = next;
    }

    function guardAfterWrite(uint256 next) external {
        value = next;
        require(msg.sender == owner, "not owner");
    }

    function returnBeforeWrite(uint256 next) external {
        if (msg.sender != owner) return;
        value = next;
    }

    function returnAfterWrite(uint256 next) external {
        value = next;
        if (msg.sender != owner) return;
    }

    function ownerOrGuardian(bool ownerBranch, uint256 next) external {
        if (ownerBranch) {
            require(msg.sender == owner, "not owner");
        } else {
            require(msg.sender == guardian, "not guardian");
        }
        value = next;
    }

    function openOrOwner(uint256 next) external {
        require(open || msg.sender == owner, "closed");
        value = next;
    }

    function setOpen(bool next) external {
        require(msg.sender == owner, "not owner");
        open = next;
    }

    function deadWrite(uint256 next) external {
        require(msg.sender == owner, "not owner");
        value = next;
        revert("always reverts");
    }

    function ownerDelegate(address target, bytes calldata data) external {
        require(msg.sender == owner, "not owner");
        (bool success,) = target.delegatecall(data);
        require(success, "delegatecall failed");
    }
}
