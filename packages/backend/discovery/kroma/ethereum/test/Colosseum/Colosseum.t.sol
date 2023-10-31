// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test } from '@harness/Test.sol';

import { Colosseum } from '@code/contracts/L1/Colosseum.sol';
import { ValidatorPool } from '@code/contracts/L1/ValidatorPool.sol';
import { L2OutputOracle } from '@code/contracts/L1/L2OutputOracle.sol';
import { Types } from '@code/contracts/libraries/Types.sol';

contract ColosseumTest is Test {
    Colosseum constant colosseum =
        Colosseum(address(0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a));
    ValidatorPool constant validatorPool =
        ValidatorPool(address(0xFdFF462845953D90719A78Fd12a2d103541d2103));
    L2OutputOracle constant l2OutputOracle =
        L2OutputOracle(address(0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6));

    address proposer;
    uint256 outputIndex = 271;
    string RPC_URL = vm.envString('RPC_URL');

    function setUp() public {
        uint256 fork = vm.createSelectFork(RPC_URL);
        uint256 blockNumber = 18148041;
        vm.rollFork(fork, blockNumber);
    }

    function checkCorrectAddresses() public {
        address derivedColosseum = l2OutputOracle.COLOSSEUM();
        address derivedValidatorPool = address(l2OutputOracle.VALIDATOR_POOL());
        assertEq(derivedColosseum, address(colosseum));
        assertEq(derivedValidatorPool, address(validatorPool));
    }

    function testIsInCreationPeriod() public {
        bool isInCreationPeriod = colosseum.isInCreationPeriod(outputIndex);
        assertTrue(isInCreationPeriod);
    }

    function _joinAsProposer() internal {
        proposer = makeAddr('proposer');
        vm.deal(proposer, 1 ether);
        vm.prank(proposer);
        validatorPool.deposit{ value: 0.2 ether }();
    }

    function testJoinAsProposer() public {
        uint256 prevValidatorCount = validatorPool.validatorCount();
        _joinAsProposer();
        assertTrue(validatorPool.isValidator(proposer));
        assertEq(validatorPool.validatorCount(), prevValidatorCount + 1);
    }

    event ChallengeCreated(
        uint256 indexed outputIndex,
        address indexed asserter,
        address indexed challenger,
        uint256 timestamp
    );

    function testCreateChallenge() public {
        uint256 blockNumber = block.number;
        bytes32 blockHash = blockhash(blockNumber);

        Types.CheckpointOutput memory prevOutput = l2OutputOracle.getL2Output(
            outputIndex - 1
        );
        Types.CheckpointOutput memory targetOutput = l2OutputOracle.getL2Output(
            outputIndex
        );

        uint256 requiredLength = colosseum.getSegmentsLength(1);
        assertEq(requiredLength, 9);
        bytes32[] memory segments = new bytes32[](requiredLength);
        segments[0] = prevOutput.outputRoot;

        _joinAsProposer();

        address asserter = targetOutput.submitter;
        vm.prank(proposer);
        vm.expectEmit(true, true, true, true);
        emit ChallengeCreated(outputIndex, asserter, proposer, block.timestamp);
        colosseum.createChallenge(
            outputIndex,
            blockHash,
            blockNumber,
            segments
        );
    }

    bytes32 dummyOutputRoot = bytes32('0x1234567890');

    function _submitInvalidL2OutputRootAsNextProposer() internal {
        address nextValidator = validatorPool.nextValidator();
        uint256 nextL2BlockNumber = l2OutputOracle.nextBlockNumber();
        uint256 blockNumber = block.number;
        bytes32 blockHash = blockhash(blockNumber);

        uint256 expectedTimestamp = l2OutputOracle.computeL2Timestamp(
            nextL2BlockNumber
        );
        vm.warp(expectedTimestamp + 1); // cannot submit future block output!

        vm.prank(nextValidator);
        l2OutputOracle.submitL2Output(
            dummyOutputRoot,
            nextL2BlockNumber,
            blockHash,
            blockNumber
        );
    }

    function testSubmitInvalidL2OutputRoot() public {
        _submitInvalidL2OutputRootAsNextProposer();
        assertEq(
            l2OutputOracle.getL2Output(outputIndex + 1).outputRoot,
            dummyOutputRoot
        );
    }

    function _waitUntilNextProposer() internal returns (uint256) {
        while (validatorPool.nextValidator() != proposer) {
            _submitInvalidL2OutputRootAsNextProposer();
        }
        return l2OutputOracle.latestOutputIndex();
    }

    function testCanBeNextValidator() public {
        _joinAsProposer();
        _waitUntilNextProposer();
        assertEq(validatorPool.nextValidator(), proposer);
    }

    function testJoinAndProposeInvalidRoot() public {
        _joinAsProposer();
        uint256 currentOutputIndex = _waitUntilNextProposer();
        _submitInvalidL2OutputRootAsNextProposer();

        Types.CheckpointOutput memory currentOutput = l2OutputOracle
            .getL2Output(currentOutputIndex + 1);

        assertEq(currentOutput.outputRoot, dummyOutputRoot);
        assertEq(currentOutput.submitter, proposer);
    }
}
