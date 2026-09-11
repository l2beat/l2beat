// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Fixture for the semantic tests (expected/ReviewCases): each function is one case the guard rules
// got wrong at review time, or one they must keep getting right. Findings are asserted per function.

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
}

abstract contract AccessControl is Context {
    mapping(bytes32 => mapping(address => bool)) private _roles;

    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function _checkRole(bytes32 role) internal view {
        _checkRole(role, _msgSender());
    }

    function _checkRole(bytes32 role, address account) internal view {
        if (!hasRole(role, account)) {
            revert("AccessControl: missing role");
        }
    }
}

contract ReviewCases is Ownable, AccessControl {
    bytes32 public constant ADMIN = keccak256("ADMIN");
    uint256 public value;
    address public guardian;

    // never-persists was claimed although stop=true keeps the write: expect no-check, and a writer
    function earlyReturn(bool stop) external {
        value = 1;
        if (stop) return;
        revert();
    }

    // "guarded against owner" hid the operator: expect always-checked with `!=` quoted
    function notOwner(uint256 v) external {
        require(msg.sender != guardian);
        value = v;
    }

    // the write behind a local function pointer was dropped silently: expect a writer, no-check
    function pointerWrite() external {
        function() internal target = _write;
        target();
    }

    // the pointer arrives as an argument: still a writer, resolved through the parameter
    function viaParam() external {
        _run(_write);
    }

    function _run(function() internal f) internal {
        f();
    }

    function _write() internal {
        value = 3;
    }

    // the check is straight-line but an earlier return skips it: expect check-after-return
    function returnThenCheck(uint256 v, bool skip) external {
        value = v;
        if (skip) return;
        require(msg.sender == guardian);
    }

    // control: the return sits after the check, so the check still runs on every completing execution
    function checkThenReturn(uint256 v, bool skip) external {
        require(msg.sender == guardian);
        if (skip) return;
        value = v;
    }

    // OpenZeppelin Ownable: the sender arrives through `_msgSender()`, the principal through `owner()`
    function ownerWrite(uint256 v) external onlyOwner {
        value = v;
    }

    // OpenZeppelin AccessControl: the sender arrives as the `account` parameter of `_checkRole`
    function adminWrite(uint256 v) external onlyRole(ADMIN) {
        value = v;
    }

    // the check is decided by a caller-supplied flag: expect caller-selectable
    function conditionalGuard(bool enforce, uint256 v) external {
        if (enforce) {
            require(msg.sender == guardian, "not guardian");
        }
        value = v;
    }
}

// Virtual dispatch: the base checks the sender in a hook; one derived contract keeps it, the other
// overrides it away. Expect always-checked for Sealed and no-check for Unlocked, from the same
// entry point body. (Locked itself is a base of other contracts, so it is not analysed as deployable.)
contract Locked {
    uint256 public value;
    address public keeper;

    function _auth() internal view virtual {
        require(msg.sender == keeper, "not keeper");
    }

    function set(uint256 v) external {
        _auth();
        value = v;
    }
}

contract Unlocked is Locked {
    function _auth() internal view override {}
}

contract Sealed is Locked {}
