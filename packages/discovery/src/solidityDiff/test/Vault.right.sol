pragma solidity 0.8.20;

import * as IERC20 from "./IERC20.sol";

library Math {
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
}

/**
 * @title Vault
 * @notice Holds user deposits.
 */
contract Vault {
    uint256 public totalDeposits;
    mapping(address => uint256) public balances;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Vault: amount must be positive");
        balances[msg.sender] += amount;
        totalDeposits += amount;
    }

    function withdraw(uint256 amount) external {
        require(
            balances[msg.sender] > amount,
            "Vault: insufficient balance"
        );
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        if (amount > 0) {
            payable(msg.sender).transfer(amount);
        }
    }

    function setOwner(address newOwner) external {
        owner = newOwner;
    }
}
