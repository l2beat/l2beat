pragma solidity ^0.8.0;

import "./IERC20.sol" as IERC20;

/// @notice Vault holding user deposits
contract Vault {
    uint public totalDeposits;
    mapping(address => uint) public balances;
    address owner;

    constructor() { owner = msg.sender; }

    function deposit(uint amount) external {
        require(amount > 0, "Vault: zero deposit");
        balances[msg.sender] += amount;
        totalDeposits += amount;
    }

    function withdraw(uint amount) external {
        // check the balance first
        require(balances[msg.sender] >= amount, 'Vault: insufficient balance');
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        if (amount > 0) payable(msg.sender).transfer(amount);
    }

    function setOwner(address newOwner) external {
        require(msg.sender == owner, "Vault: not owner");
        owner = newOwner;
    }
}

library Math {
    function max(uint a, uint b) internal pure returns (uint) { return a > b ? a : b; }
}
