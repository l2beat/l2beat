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

    function _challengeOutputRoot(address challenger, uint256 index) internal {
        uint256 blockNumber = block.number;
        bytes32 blockHash = blockhash(blockNumber);

        Types.CheckpointOutput memory prevOutput = l2OutputOracle.getL2Output(
            index - 1
        );

        uint256 requiredLength = colosseum.getSegmentsLength(1);
        assertEq(requiredLength, 9);
        bytes32[] memory segments = new bytes32[](requiredLength);
        segments[0] = prevOutput.outputRoot;

        vm.prank(challenger);
        colosseum.createChallenge(index, blockHash, blockNumber, segments);
    }

    function testCreateChallenge() public {
        _joinAsProposer();
        Types.CheckpointOutput memory targetOutput = l2OutputOracle.getL2Output(
            outputIndex
        );
        address asserter = targetOutput.submitter;
        vm.prank(proposer);
        vm.expectEmit(true, true, true, true);
        emit ChallengeCreated(outputIndex, asserter, proposer, block.timestamp);
        _challengeOutputRoot(proposer, outputIndex);
    }

    function _submitInvalidRootAndChallenge(
        address challenger
    ) internal returns (uint256) {
        _joinAsProposer();
        uint256 currentOutputIndex = _waitUntilNextProposer();
        _submitInvalidL2OutputRootAsNextProposer();

        _challengeOutputRoot(challenger, currentOutputIndex + 1);
        return currentOutputIndex + 1;
    }

    function testSubmitInvalidL2OutputRootAndChallenge() public {
        address challenger = validatorPool.nextValidator();
        uint256 indexToChallenge = _submitInvalidRootAndChallenge(challenger);
        (, , address _asserter, address _challenger, , ) = colosseum.challenges(
            indexToChallenge,
            challenger
        );
        assertEq(_asserter, proposer);
        assertEq(_challenger, challenger);
    }

    event Bisected(
        uint256 indexed outputIndex,
        address indexed challenger,
        uint8 turn,
        uint256 timestamp
    );

    event ReadyToProve(uint256 indexed outputIndex, address indexed challenger);

    function testSubmitInvalidL2OutputRootAndChallengeAndBisectTillReadyToProve()
        public
    {
        address challenger = validatorPool.nextValidator();
        // the proposer (also called asserter) has submitted the invalid root
        // and the challenger has challenged it
        uint256 indexInChallenge = _submitInvalidRootAndChallenge(challenger);

        address asserter = proposer;

        // note that we always bisect between the first root and the next one

        // now the asserter has to respond to the challenge with segments of length 6
        bytes32[] memory segments_1 = new bytes32[](6);
        Types.CheckpointOutput memory prevOutput = l2OutputOracle.getL2Output(
            indexInChallenge - 1
        );
        segments_1[0] = prevOutput.outputRoot;
        segments_1[5] = bytes32('0x111');
        vm.expectEmit(true, true, true, true);
        uint timestamp = block.timestamp;
        emit Bisected(indexInChallenge, challenger, 2, timestamp);
        vm.prank(asserter);
        colosseum.bisect(indexInChallenge, challenger, 0, segments_1);

        // now the challenger has to respond with segments of length 10
        bytes32[] memory segments_2 = new bytes32[](10);
        segments_2[0] = prevOutput.outputRoot;
        segments_2[9] = bytes32('0x222');
        vm.expectEmit(true, true, true, true);
        emit Bisected(indexInChallenge, challenger, 3, timestamp);
        vm.prank(challenger);
        colosseum.bisect(indexInChallenge, challenger, 0, segments_2);

        // now the asserter has to respond with segments of length 6
        bytes32[] memory segments_3 = new bytes32[](6);
        segments_3[0] = prevOutput.outputRoot;
        segments_3[5] = bytes32('0x333');
        vm.expectEmit(true, true, true, true);
        // check that the last step is ready to be zk proven!
        emit ReadyToProve(indexInChallenge, challenger);
        vm.prank(asserter);
        colosseum.bisect(indexInChallenge, challenger, 0, segments_3);
    }
}
