// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script } from '@harness/Script.sol';
import { console } from '@harness/Test.sol';

import { ValidatorPool } from '@code/contracts/L1/ValidatorPool.sol';

contract ProposeRoot is Script {
    ValidatorPool constant validatorPool =
        // ValidatorPool(address(0xFdFF462845953D90719A78Fd12a2d103541d2103)); // mainnet
        ValidatorPool(address(0xbc171C51D9e3E0b24AA4606824e45F93DdE6E352)); // sepolia

    uint256 myPrivateKey = vm.envUint("MY_PRIVATE_KEY");
    address myAddress = vm.envAddress("MY_ADDRESS");

    function run() public {
        console.log('Starting ProposeRoot script.');

        uint256 proposerCount = validatorPool.validatorCount();
        console.log('Current proposer count:', proposerCount);

        address curProposer = validatorPool.nextValidator();
        console.log('Current proposer:', curProposer);

        bool iAmProposerBefore = validatorPool.isValidator(myAddress);
        console.log('Am I proposer =', iAmProposerBefore);

        uint256 deposit = 0.1 ether;
        console.log('Depositing ether to become a proposer:', deposit);
        vm.startBroadcast(myPrivateKey);
        validatorPool.deposit{ value: deposit }();
        vm.stopBroadcast();

        bool iAmProposerAfter = validatorPool.isValidator(myAddress);
        console.log('Am I proposer =', iAmProposerAfter);
    }
}