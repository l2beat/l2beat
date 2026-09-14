// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Fixture for rules/2-guards.dl: one function per control-flow shape, each writing `v`.
// The expected tuples in expected/Guards/ were read off this file by hand.

interface IGate {
    function authorize(address caller) external;
}

contract Guards {
    uint256 public v;
    address public owner;
    address public admin;
    bool public flag;
    IGate public gate;
    address[] public members;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier ownerOrForward() {
        if (msg.sender == owner) {
            _;
        } else {
            revert("forwarded");
        }
    }

    modifier afterCheck() {
        _;
        require(v < 100, "too big");
    }

    function _mustBeAdmin() internal view {
        require(msg.sender == admin, "not admin");
    }

    // 1. require before and after the write: both guard it
    function requireAround(uint256 x) external {
        require(x > 0, "zero");
        v = x;
        require(v < 10, "big");
    }

    // 2. a return between the write and a later require: the require guards nothing
    function returnBetween(uint256 x) external {
        v = x;
        if (flag) return;
        require(x < 10, "big");
    }

    // 3. if-abort before the write, both polarities
    function ifAbort(uint256 x) external {
        if (x == 0) revert("zero");
        if (x < 100) {
            v = x;
        } else {
            revert("big");
        }
    }

    // 4. if-return before the write: reached only when the condition is false
    function ifReturn(uint256 x) external {
        if (x == 0) return;
        v = x;
    }

    // 5. write in a branch, write in the other branch
    function branches(uint256 x) external {
        if (msg.sender == owner) {
            v = x;
        } else {
            v = x + 1;
        }
    }

    // 6. write in a for loop, with a break after it; and a do-while
    function loops(uint256 x) external {
        for (uint256 i = 0; i < members.length; i++) {
            v = i;
            if (x == i) break;
            require(members[i] != address(0), "hole");
        }
        do {
            v = x;
        } while (false);
    }

    // 7. modifiers: require before `_`, `_` inside a branch, require after `_`
    function viaModifier(uint256 x) external onlyOwner {
        v = x;
    }

    function viaBranchModifier(uint256 x) external ownerOrForward {
        v = x;
    }

    function viaAfterModifier(uint256 x) external afterCheck {
        v = x;
    }

    // 8. an internal helper that checks, called before the write
    function viaHelper(uint256 x) external {
        _mustBeAdmin();
        v = x;
    }

    // 9. an external call before the write
    function viaGate(uint256 x) external {
        gate.authorize(msg.sender);
        v = x;
    }

    // 10. try/catch around the gate: the write in the success clause, another after the try
    function viaTry(uint256 x) external {
        try gate.authorize(msg.sender) {
            v = x;
        } catch {
            v = 0;
        }
        v = v + x;
    }

    // 11. write followed by an unconditional revert: never persists
    function writeThenRevert(uint256 x) external {
        v = x;
        revert("undo");
    }

    // 12. low-level call whose success is dropped, and one whose success is required
    function lowLevel(uint256 x, bytes calldata data) external {
        address(gate).call(data);
        (bool ok, ) = address(gate).call(data);
        require(ok, "call failed");
        v = x;
    }

    // 13. nested ifs that revert on failure
    function nested(uint256 x) external {
        if (msg.sender != owner) {
            if (msg.sender != admin) {
                revert("neither");
            }
        }
        v = x;
    }
}
