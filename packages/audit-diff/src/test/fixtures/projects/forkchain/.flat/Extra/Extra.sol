pragma solidity ^0.8.0;

contract Extra {
    uint256 public counter;

    function bump() external {
        counter += 1;
    }

    function reset() external {
        counter = 0;
    }
}
