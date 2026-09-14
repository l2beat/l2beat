// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// A cut-down OpenZeppelin AccessControl: roles are keccak256 of their names, each role has members
/// and an admin role, and `onlyRole` reverts for everyone else. Discovery records the roles by name.
contract Scores {
    struct RoleData {
        mapping(address account => bool) hasRole;
        bytes32 adminRole;
    }

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant SCORER_ROLE = keccak256("SCORER_ROLE");

    mapping(bytes32 role => RoleData) private _roles;
    uint256 public score;

    constructor(address admin) {
        _roles[DEFAULT_ADMIN_ROLE].hasRole[admin] = true;
        _roles[SCORER_ROLE].adminRole = DEFAULT_ADMIN_ROLE;
    }

    modifier onlyRole(bytes32 role) {
        _checkRole(role, msg.sender);
        _;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role].hasRole[account];
    }

    function getRoleAdmin(bytes32 role) public view returns (bytes32) {
        return _roles[role].adminRole;
    }

    function _checkRole(bytes32 role, address account) internal view {
        if (!hasRole(role, account)) {
            revert("Scores: missing role");
        }
    }

    function grantRole(bytes32 role, address account) external onlyRole(getRoleAdmin(role)) {
        _roles[role].hasRole[account] = true;
    }

    function revokeRole(bytes32 role, address account) external onlyRole(getRoleAdmin(role)) {
        _roles[role].hasRole[account] = false;
    }

    function setScore(uint256 next) external onlyRole(SCORER_ROLE) {
        score = next;
    }
}
