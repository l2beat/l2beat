// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test } from "@harness/Test.sol";

import { KromaPortal } from "@code/contracts/L1/KromaPortal.sol";

contract KromaPortalTest is Test {
    KromaPortal constant portal = KromaPortal(payable (address(0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a)));

    string RPC_URL = vm.envString("RPC_URL");

    function setUp() public {
        uint256 fork = vm.createSelectFork(RPC_URL);
        uint256 blockNumber = 18148041;
        vm.rollFork(fork, blockNumber);
    }
}
