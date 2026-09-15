pragma solidity ^0.8.0;

// deployed copy
contract Vault {
    uint256 public total;

    function deposit(uint256 amount) external {
        total += amount;
    }

    function withdraw(uint256 amount) external {
        require(amount <= total, "insufficient");
        total -= amount;
    }

    function balance() external view returns (uint256) {
        return total;
    }
}
