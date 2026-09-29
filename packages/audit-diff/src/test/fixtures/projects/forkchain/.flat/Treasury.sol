pragma solidity ^0.8.0;

contract Treasury {
    uint256 public total;
    event Withdrawn(uint256 amount);

    function deposit(uint256 amount) external {
        total += amount;
    }

    function withdraw(uint256 amount) external {
        require(amount <= total, "too much");
        total -= amount;
        emit Withdrawn(amount);
    }

    function balance() external view returns (uint256) {
        return total;
    }
}

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == owner);
        owner = newOwner;
    }
}
