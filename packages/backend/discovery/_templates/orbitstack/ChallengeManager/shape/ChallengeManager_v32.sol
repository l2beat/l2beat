// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

struct ExecutionContext {
    uint256 maxInboxMessagesRead;
    IBridge bridge;
}

library OneStepProofEntryLib {
    uint256 internal constant MAX_STEPS = 1 << 43;
}

library GlobalStateLib {
    uint16 internal constant BYTES32_VALS_NUM = 2;
    uint16 internal constant U64_VALS_NUM = 2;

    function hash(GlobalState memory state) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Global state:",
                    state.bytes32Vals[0],
                    state.bytes32Vals[1],
                    state.u64Vals[0],
                    state.u64Vals[1]
                )
            );
    }

    function getBlockHash(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[0];
    }

    function getSendRoot(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[1];
    }

    function getInboxPosition(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[0];
    }

    function getPositionInMessage(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[1];
    }

    function isEmpty(GlobalState calldata state) internal pure returns (bool) {
        return (state.bytes32Vals[0] == bytes32(0) &&
            state.bytes32Vals[1] == bytes32(0) &&
            state.u64Vals[0] == 0 &&
            state.u64Vals[1] == 0);
    }
}

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
}

library StackFrameLib {
    using ValueLib for Value;

    function hash(StackFrame memory frame) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Stack frame:",
                    frame.returnPc.hash(),
                    frame.localsMerkleRoot,
                    frame.callerModule,
                    frame.callerModuleInternals
                )
            );
    }

    function hash(StackFrameWindow memory window) internal pure returns (bytes32 h) {
        h = window.remainingHash;
        for (uint256 i = 0; i < window.proved.length; i++) {
            h = keccak256(abi.encodePacked("Stack frame stack:", hash(window.proved[i]), h));
        }
    }

    function peek(StackFrameWindow memory window) internal pure returns (StackFrame memory) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        return window.proved[0];
    }

    function pop(StackFrameWindow memory window) internal pure returns (StackFrame memory frame) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        frame = window.proved[0];
        window.proved = new StackFrame[](0);
    }

    function push(StackFrameWindow memory window, StackFrame memory frame) internal pure {
        StackFrame[] memory newProved = new StackFrame[](window.proved.length + 1);
        for (uint256 i = 0; i < window.proved.length; i++) {
            newProved[i] = window.proved[i];
        }
        newProved[window.proved.length] = frame;
        window.proved = newProved;
    }

    function overwrite(StackFrameWindow memory window, bytes32 root) internal pure {
        window.remainingHash = root;
        delete window.proved;
    }
}

library ValueLib {
    function hash(Value memory val) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Value:", val.valueType, val.contents));
    }

    function maxValueType() internal pure returns (ValueType) {
        return ValueType.INTERNAL_REF;
    }

    function assumeI32(Value memory val) internal pure returns (uint32) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I32, "NOT_I32");
        require(uintval < (1 << 32), "BAD_I32");
        return uint32(uintval);
    }

    function assumeI64(Value memory val) internal pure returns (uint64) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I64, "NOT_I64");
        require(uintval < (1 << 64), "BAD_I64");
        return uint64(uintval);
    }

    function newRefNull() internal pure returns (Value memory) {
        return Value({valueType: ValueType.REF_NULL, contents: 0});
    }

    function newI32(uint32 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I32, contents: uint256(x)});
    }

    function newI64(uint64 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I64, contents: uint256(x)});
    }

    function newBoolean(bool x) internal pure returns (Value memory) {
        if (x) {
            return newI32(uint32(1));
        } else {
            return newI32(uint32(0));
        }
    }

    function newPc(
        uint32 funcPc,
        uint32 func,
        uint32 module
    ) internal pure returns (Value memory) {
        uint256 data = 0;
        data |= funcPc;
        data |= uint256(func) << 32;
        data |= uint256(module) << 64;
        return Value({valueType: ValueType.INTERNAL_REF, contents: data});
    }
}

library ValueArrayLib {
    function get(ValueArray memory arr, uint256 index) internal pure returns (Value memory) {
        return arr.inner[index];
    }

    function set(
        ValueArray memory arr,
        uint256 index,
        Value memory val
    ) internal pure {
        arr.inner[index] = val;
    }

    function length(ValueArray memory arr) internal pure returns (uint256) {
        return arr.inner.length;
    }

    function push(ValueArray memory arr, Value memory val) internal pure {
        Value[] memory newInner = new Value[](arr.inner.length + 1);
        for (uint256 i = 0; i < arr.inner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        newInner[arr.inner.length] = val;
        arr.inner = newInner;
    }

    function pop(ValueArray memory arr) internal pure returns (Value memory popped) {
        popped = arr.inner[arr.inner.length - 1];
        Value[] memory newInner = new Value[](arr.inner.length - 1);
        for (uint256 i = 0; i < newInner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        arr.inner = newInner;
    }
}

library ValueStackLib {
    using ValueLib for Value;
    using ValueArrayLib for ValueArray;

    function hash(ValueStack memory stack) internal pure returns (bytes32 h) {
        h = stack.remainingHash;
        uint256 len = stack.proved.length();
        for (uint256 i = 0; i < len; i++) {
            h = keccak256(abi.encodePacked("Value stack:", stack.proved.get(i).hash(), h));
        }
    }

    function peek(ValueStack memory stack) internal pure returns (Value memory) {
        uint256 len = stack.proved.length();
        return stack.proved.get(len - 1);
    }

    function pop(ValueStack memory stack) internal pure returns (Value memory) {
        return stack.proved.pop();
    }

    function push(ValueStack memory stack, Value memory val) internal pure {
        return stack.proved.push(val);
    }

    function overwrite(ValueStack memory stack, bytes32 root) internal pure {
        stack.remainingHash = root;
        delete stack.proved;
    }
}

library MultiStackLib {
    bytes32 internal constant NO_STACK_HASH = ~bytes32(0);

    function hash(
        MultiStack memory multi,
        bytes32 activeStackHash,
        bool cothread
    ) internal pure returns (bytes32) {
        require(activeStackHash != NO_STACK_HASH, "MULTISTACK_NOSTACK_ACTIVE");
        if (cothread) {
            require(multi.inactiveStackHash != NO_STACK_HASH, "MULTISTACK_NOSTACK_MAIN");
            return
                keccak256(
                    abi.encodePacked(
                        "multistack:",
                        multi.inactiveStackHash,
                        activeStackHash,
                        multi.remainingHash
                    )
                );
        } else {
            return
                keccak256(
                    abi.encodePacked(
                        "multistack:",
                        activeStackHash,
                        multi.inactiveStackHash,
                        multi.remainingHash
                    )
                );
        }
    }

    function setEmpty(MultiStack memory multi) internal pure {
        multi.inactiveStackHash = NO_STACK_HASH;
        multi.remainingHash = 0;
    }

    function pushNew(MultiStack memory multi) internal pure {
        if (multi.inactiveStackHash != NO_STACK_HASH) {
            multi.remainingHash = keccak256(
                abi.encodePacked("cothread:", multi.inactiveStackHash, multi.remainingHash)
            );
        }
        multi.inactiveStackHash = 0;
    }
}

struct ValueArray {
    Value[] inner;
}

struct ValueStack {
    ValueArray proved;
    bytes32 remainingHash;
}

struct MultiStack {
    bytes32 inactiveStackHash; // NO_STACK_HASH if no stack, 0 if empty stack
    bytes32 remainingHash; // 0 if less than 2 cothreads exist
}

struct StackFrame {
    Value returnPc;
    bytes32 localsMerkleRoot;
    uint32 callerModule;
    uint32 callerModuleInternals;
}

struct StackFrameWindow {
    StackFrame[] proved;
    bytes32 remainingHash;
}

struct Machine {
    MachineStatus status;
    ValueStack valueStack;
    MultiStack valueMultiStack;
    ValueStack internalStack;
    StackFrameWindow frameStack;
    MultiStack frameMultiStack;
    bytes32 globalStateHash;
    uint32 moduleIdx;
    uint32 functionIdx;
    uint32 functionPc;
    bytes32 recoveryPc;
    bytes32 modulesRoot;
}

struct Value {
    ValueType valueType;
    uint256 contents;
}

enum ValueType {
    I32,
    I64,
    F32,
    F64,
    REF_NULL,
    FUNC_REF,
    INTERNAL_REF
}

library MachineLib {
    using StackFrameLib for StackFrameWindow;
    using ValueStackLib for ValueStack;
    using MultiStackLib for MultiStack;

    bytes32 internal constant NO_RECOVERY_PC = ~bytes32(0);

    function hash(Machine memory mach) internal pure returns (bytes32) {
        // Warning: the non-running hashes are replicated in Challenge
        if (mach.status == MachineStatus.RUNNING) {
            bytes32 valueMultiHash = mach.valueMultiStack.hash(
                mach.valueStack.hash(),
                mach.recoveryPc != NO_RECOVERY_PC
            );
            bytes32 frameMultiHash = mach.frameMultiStack.hash(
                mach.frameStack.hash(),
                mach.recoveryPc != NO_RECOVERY_PC
            );
            bytes memory preimage = abi.encodePacked(
                "Machine running:",
                valueMultiHash,
                mach.internalStack.hash(),
                frameMultiHash,
                mach.globalStateHash,
                mach.moduleIdx,
                mach.functionIdx,
                mach.functionPc,
                mach.recoveryPc,
                mach.modulesRoot
            );
            return keccak256(preimage);
        } else if (mach.status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Machine finished:", mach.globalStateHash));
        } else if (mach.status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Machine errored:"));
        } else if (mach.status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Machine too far:"));
        } else {
            revert("BAD_MACH_STATUS");
        }
    }

    function switchCoThreadStacks(Machine memory mach) internal pure {
        bytes32 newActiveValue = mach.valueMultiStack.inactiveStackHash;
        bytes32 newActiveFrame = mach.frameMultiStack.inactiveStackHash;
        if (
            newActiveFrame == MultiStackLib.NO_STACK_HASH ||
            newActiveValue == MultiStackLib.NO_STACK_HASH
        ) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        mach.frameMultiStack.inactiveStackHash = mach.frameStack.hash();
        mach.valueMultiStack.inactiveStackHash = mach.valueStack.hash();
        mach.frameStack.overwrite(newActiveFrame);
        mach.valueStack.overwrite(newActiveValue);
    }

    function setPcFromData(Machine memory mach, uint256 data) internal pure returns (bool) {
        if (data >> 96 != 0) {
            return false;
        }

        mach.functionPc = uint32(data);
        mach.functionIdx = uint32(data >> 32);
        mach.moduleIdx = uint32(data >> 64);
        return true;
    }

    function setPcFromRecovery(Machine memory mach) internal pure returns (bool) {
        if (!setPcFromData(mach, uint256(mach.recoveryPc))) {
            return false;
        }
        mach.recoveryPc = NO_RECOVERY_PC;
        return true;
    }

    function setRecoveryFromPc(Machine memory mach, uint32 offset) internal pure returns (bool) {
        if (mach.recoveryPc != NO_RECOVERY_PC) {
            return false;
        }

        uint256 result;
        result = uint256(mach.moduleIdx) << 64;
        result = result | (uint256(mach.functionIdx) << 32);
        result = result | uint256(mach.functionPc + offset - 1);
        mach.recoveryPc = bytes32(result);
        return true;
    }

    function setPc(Machine memory mach, Value memory pc) internal pure {
        if (pc.valueType == ValueType.REF_NULL) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (pc.valueType != ValueType.INTERNAL_REF) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (!setPcFromData(mach, pc.contents)) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
    }
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED,
    TOO_FAR
}

library ChallengeLib {
    using MachineLib for Machine;
    using ChallengeLib for Challenge;

    /// @dev It's assumed that that uninitialzed challenges have mode NONE
    enum ChallengeMode {
        NONE,
        BLOCK,
        EXECUTION
    }

    struct Participant {
        address addr;
        uint256 timeLeft;
    }

    struct Challenge {
        Participant current;
        Participant next;
        uint256 lastMoveTimestamp;
        bytes32 wasmModuleRoot;
        bytes32 challengeStateHash;
        uint64 maxInboxMessages;
        ChallengeMode mode;
    }

    struct SegmentSelection {
        uint256 oldSegmentsStart;
        uint256 oldSegmentsLength;
        bytes32[] oldSegments;
        uint256 challengePosition;
    }

    function timeUsedSinceLastMove(Challenge storage challenge) internal view returns (uint256) {
        return block.timestamp - challenge.lastMoveTimestamp;
    }

    function isTimedOut(Challenge storage challenge) internal view returns (bool) {
        return challenge.timeUsedSinceLastMove() > challenge.current.timeLeft;
    }

    function extractChallengeSegment(SegmentSelection calldata selection)
        internal
        pure
        returns (uint256 segmentStart, uint256 segmentLength)
    {
        uint256 oldChallengeDegree = selection.oldSegments.length - 1;
        segmentLength = selection.oldSegmentsLength / oldChallengeDegree;
        // Intentionally done before challengeLength is potentially added to for the final segment
        segmentStart = selection.oldSegmentsStart + segmentLength * selection.challengePosition;
        if (selection.challengePosition == selection.oldSegments.length - 2) {
            segmentLength += selection.oldSegmentsLength % oldChallengeDegree;
        }
    }

    function hashChallengeState(
        uint256 segmentsStart,
        uint256 segmentsLength,
        bytes32[] memory segments
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(segmentsStart, segmentsLength, segments));
    }

    function blockStateHash(MachineStatus status, bytes32 globalStateHash)
        internal
        pure
        returns (bytes32)
    {
        if (status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Block state:", globalStateHash));
        } else if (status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Block state, errored:", globalStateHash));
        } else if (status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Block state, too far:"));
        } else {
            revert("BAD_BLOCK_STATUS");
        }
    }
}

interface IChallengeManager {
    enum ChallengeTerminationType {
        TIMEOUT,
        BLOCK_PROOF,
        EXECUTION_PROOF,
        CLEARED
    }

    event InitiatedChallenge(
        uint64 indexed challengeIndex,
        GlobalState startState,
        GlobalState endState
    );

    event Bisected(
        uint64 indexed challengeIndex,
        bytes32 indexed challengeRoot,
        uint256 challengedSegmentStart,
        uint256 challengedSegmentLength,
        bytes32[] chainHashes
    );

    event ExecutionChallengeBegun(uint64 indexed challengeIndex, uint256 blockSteps);
    event OneStepProofCompleted(uint64 indexed challengeIndex);

    event ChallengeEnded(uint64 indexed challengeIndex, ChallengeTerminationType kind);

    function initialize(
        IChallengeResultReceiver resultReceiver_,
        ISequencerInbox sequencerInbox_,
        IBridge bridge_,
        IOneStepProofEntry osp_
    ) external;

    function postUpgradeInit(
        IOneStepProofEntry osp_,
        bytes32 condRoot,
        IOneStepProofEntry condOsp
    ) external;

    /// @notice Get the default osp, which is used for all wasm module roots that don't have a conditional OSP set
    ///         Use getOsp(wasmModuleRoot) to get the OSP for a specific wasm module root
    function osp() external view returns (IOneStepProofEntry);

    /// @notice Get the OSP for a given wasm module root
    function getOsp(bytes32 wasmModuleRoot) external view returns (IOneStepProofEntry);

    function createChallenge(
        bytes32 wasmModuleRoot_,
        MachineStatus[2] calldata startAndEndMachineStatuses_,
        GlobalState[2] calldata startAndEndGlobalStates_,
        uint64 numBlocks,
        address asserter_,
        address challenger_,
        uint256 asserterTimeLeft_,
        uint256 challengerTimeLeft_
    ) external returns (uint64);

    function challengeInfo(uint64 challengeIndex_)
        external
        view
        returns (ChallengeLib.Challenge memory);

    function currentResponder(uint64 challengeIndex) external view returns (address);

    function isTimedOut(uint64 challengeIndex) external view returns (bool);

    function clearChallenge(uint64 challengeIndex_) external;

    function timeout(uint64 challengeIndex_) external;
}

abstract contract DelegateCallAware {
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegate call. This allows a function to be
     * callable on the proxy contract but not on the logic contract.
     */
    modifier onlyDelegated() {
        require(address(this) != __self, "Function must be called through delegatecall");
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(address(this) == __self, "Function must not be called through delegatecall");
        _;
    }

    /// @dev Check that msg.sender is the current EIP 1967 proxy admin
    modifier onlyProxyOwner() {
        // Storage slot with the admin of the proxy contract
        // This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1
        bytes32 slot = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;
        address admin;
        assembly {
            admin := sload(slot)
        }
        if (msg.sender != admin) revert NotOwner(msg.sender, admin);
        _;
    }
}

contract ChallengeManager is DelegateCallAware, IChallengeManager {
    using GlobalStateLib for GlobalState;
    using MachineLib for Machine;
    using ChallengeLib for ChallengeLib.Challenge;

    enum ChallengeModeRequirement {
        ANY,
        BLOCK,
        EXECUTION
    }

    string private constant NO_CHAL = "NO_CHAL";
    uint256 private constant MAX_CHALLENGE_DEGREE = 40;

    uint64 public totalChallengesCreated;
    mapping(uint256 => ChallengeLib.Challenge) public challenges;

    IChallengeResultReceiver public resultReceiver;

    ISequencerInbox public sequencerInbox;
    IBridge public bridge;
    IOneStepProofEntry public osp;
    mapping(bytes32 => IOneStepProofEntry) public ospCond;

    function challengeInfo(uint64 challengeIndex)
        external
        view
        override
        returns (ChallengeLib.Challenge memory)
    {
        return challenges[challengeIndex];
    }

    modifier takeTurn(
        uint64 challengeIndex,
        ChallengeLib.SegmentSelection calldata selection,
        ChallengeModeRequirement expectedMode
    ) {
        ChallengeLib.Challenge storage challenge = challenges[challengeIndex];
        require(msg.sender == currentResponder(challengeIndex), "CHAL_SENDER");
        require(!isTimedOut(challengeIndex), "CHAL_DEADLINE");

        if (expectedMode == ChallengeModeRequirement.ANY) {
            require(challenge.mode != ChallengeLib.ChallengeMode.NONE, NO_CHAL);
        } else if (expectedMode == ChallengeModeRequirement.BLOCK) {
            require(challenge.mode == ChallengeLib.ChallengeMode.BLOCK, "CHAL_NOT_BLOCK");
        } else if (expectedMode == ChallengeModeRequirement.EXECUTION) {
            require(challenge.mode == ChallengeLib.ChallengeMode.EXECUTION, "CHAL_NOT_EXECUTION");
        } else {
            assert(false);
        }

        require(
            challenge.challengeStateHash ==
                ChallengeLib.hashChallengeState(
                    selection.oldSegmentsStart,
                    selection.oldSegmentsLength,
                    selection.oldSegments
                ),
            "BIS_STATE"
        );
        if (
            selection.oldSegments.length < 2 ||
            selection.challengePosition >= selection.oldSegments.length - 1
        ) {
            revert("BAD_CHALLENGE_POS");
        }

        _;

        if (challenge.mode == ChallengeLib.ChallengeMode.NONE) {
            // Early return since challenge must have terminated
            return;
        }

        ChallengeLib.Participant memory current = challenge.current;
        current.timeLeft -= block.timestamp - challenge.lastMoveTimestamp;

        challenge.current = challenge.next;
        challenge.next = current;

        challenge.lastMoveTimestamp = block.timestamp;
    }

    function initialize(
        IChallengeResultReceiver resultReceiver_,
        ISequencerInbox sequencerInbox_,
        IBridge bridge_,
        IOneStepProofEntry osp_
    ) external override onlyDelegated {
        require(address(resultReceiver) == address(0), "ALREADY_INIT");
        require(address(resultReceiver_) != address(0), "NO_RESULT_RECEIVER");
        resultReceiver = resultReceiver_;
        sequencerInbox = sequencerInbox_;
        bridge = bridge_;
        osp = osp_;
    }

    /// @dev A osp breaking change is introduced as part of Stylus upgrade, where the new osp would not support
    ///      pre-Stylus legacy wasmModuleRoot. To ensure that the new osp is not used for legacy wasmModuleRoot,
    ///      we introduce a conditional OSP where condRoot should be set to the pre-Stylus root and condOsp should
    ///      be set to the pre-Stylus osp. The correct value should be handled by the upgrade action contract.
    function postUpgradeInit(
        IOneStepProofEntry osp_,
        bytes32 condRoot,
        IOneStepProofEntry condOsp
    ) external onlyDelegated onlyProxyOwner {
        ospCond[condRoot] = condOsp;
        osp = osp_;
    }

    function getOsp(bytes32 wasmModuleRoot) public view returns (IOneStepProofEntry) {
        IOneStepProofEntry t = ospCond[wasmModuleRoot];
        if (address(t) == address(0)) {
            return osp;
        } else {
            return t;
        }
    }

    function createChallenge(
        bytes32 wasmModuleRoot_,
        MachineStatus[2] calldata startAndEndMachineStatuses_,
        GlobalState[2] calldata startAndEndGlobalStates_,
        uint64 numBlocks,
        address asserter_,
        address challenger_,
        uint256 asserterTimeLeft_,
        uint256 challengerTimeLeft_
    ) external override returns (uint64) {
        require(msg.sender == address(resultReceiver), "ONLY_ROLLUP_CHAL");
        bytes32[] memory segments = new bytes32[](2);
        segments[0] = ChallengeLib.blockStateHash(
            startAndEndMachineStatuses_[0],
            startAndEndGlobalStates_[0].hash()
        );
        segments[1] = ChallengeLib.blockStateHash(
            startAndEndMachineStatuses_[1],
            startAndEndGlobalStates_[1].hash()
        );

        uint64 challengeIndex = ++totalChallengesCreated;
        // The following is an assertion since it should never be possible, but it's an important invariant
        assert(challengeIndex != NO_CHAL_INDEX);
        ChallengeLib.Challenge storage challenge = challenges[challengeIndex];
        challenge.wasmModuleRoot = wasmModuleRoot_;

        // See validator/assertion.go ExecutionState RequiredBatches() for reasoning
        uint64 maxInboxMessagesRead = startAndEndGlobalStates_[1].getInboxPosition();
        if (
            startAndEndMachineStatuses_[1] == MachineStatus.ERRORED ||
            startAndEndGlobalStates_[1].getPositionInMessage() > 0
        ) {
            maxInboxMessagesRead++;
        }
        challenge.maxInboxMessages = maxInboxMessagesRead;
        challenge.next = ChallengeLib.Participant({addr: asserter_, timeLeft: asserterTimeLeft_});
        challenge.current = ChallengeLib.Participant({
            addr: challenger_,
            timeLeft: challengerTimeLeft_
        });
        challenge.lastMoveTimestamp = block.timestamp;
        challenge.mode = ChallengeLib.ChallengeMode.BLOCK;

        emit InitiatedChallenge(
            challengeIndex,
            startAndEndGlobalStates_[0],
            startAndEndGlobalStates_[1]
        );
        completeBisection(challengeIndex, 0, numBlocks, segments);
        return challengeIndex;
    }

    /**
     * @notice Initiate the next round in the bisection by objecting to execution correctness with a bisection
     * of an execution segment with the same length but a different endpoint. This is either the initial move
     * or follows another execution objection
     */
    function bisectExecution(
        uint64 challengeIndex,
        ChallengeLib.SegmentSelection calldata selection,
        bytes32[] calldata newSegments
    ) external takeTurn(challengeIndex, selection, ChallengeModeRequirement.ANY) {
        (uint256 challengeStart, uint256 challengeLength) = ChallengeLib.extractChallengeSegment(
            selection
        );
        require(challengeLength > 1, "TOO_SHORT");
        {
            uint256 expectedDegree = challengeLength;
            if (expectedDegree > MAX_CHALLENGE_DEGREE) {
                expectedDegree = MAX_CHALLENGE_DEGREE;
            }
            require(newSegments.length == expectedDegree + 1, "WRONG_DEGREE");
        }

        requireValidBisection(selection, newSegments[0], newSegments[newSegments.length - 1]);

        completeBisection(challengeIndex, challengeStart, challengeLength, newSegments);
    }

    function challengeExecution(
        uint64 challengeIndex,
        ChallengeLib.SegmentSelection calldata selection,
        MachineStatus[2] calldata machineStatuses,
        bytes32[2] calldata globalStateHashes,
        uint256 numSteps
    ) external takeTurn(challengeIndex, selection, ChallengeModeRequirement.BLOCK) {
        require(numSteps >= 1, "CHALLENGE_TOO_SHORT");
        require(numSteps <= OneStepProofEntryLib.MAX_STEPS, "CHALLENGE_TOO_LONG");
        requireValidBisection(
            selection,
            ChallengeLib.blockStateHash(machineStatuses[0], globalStateHashes[0]),
            ChallengeLib.blockStateHash(machineStatuses[1], globalStateHashes[1])
        );

        ChallengeLib.Challenge storage challenge = challenges[challengeIndex];
        (uint256 executionChallengeAtSteps, uint256 challengeLength) = ChallengeLib
            .extractChallengeSegment(selection);
        require(challengeLength == 1, "TOO_LONG");

        if (machineStatuses[0] != MachineStatus.FINISHED) {
            // If the machine is in a halted state, it can't change
            require(
                machineStatuses[0] == machineStatuses[1] &&
                    globalStateHashes[0] == globalStateHashes[1],
                "HALTED_CHANGE"
            );
            _currentWin(challengeIndex, ChallengeTerminationType.BLOCK_PROOF);
            return;
        }

        if (machineStatuses[1] == MachineStatus.ERRORED) {
            // If the machine errors, it must return to the previous global state
            require(globalStateHashes[0] == globalStateHashes[1], "ERROR_CHANGE");
        }

        bytes32[] memory segments = new bytes32[](2);
        IOneStepProofEntry _osp = getOsp(challenge.wasmModuleRoot);
        segments[0] = _osp.getStartMachineHash(globalStateHashes[0], challenge.wasmModuleRoot);
        segments[1] = _osp.getEndMachineHash(machineStatuses[1], globalStateHashes[1]);

        challenge.mode = ChallengeLib.ChallengeMode.EXECUTION;

        completeBisection(challengeIndex, 0, numSteps, segments);

        emit ExecutionChallengeBegun(challengeIndex, executionChallengeAtSteps);
    }

    function oneStepProveExecution(
        uint64 challengeIndex,
        ChallengeLib.SegmentSelection calldata selection,
        bytes calldata proof
    ) external takeTurn(challengeIndex, selection, ChallengeModeRequirement.EXECUTION) {
        ChallengeLib.Challenge storage challenge = challenges[challengeIndex];
        uint256 challengeStart;
        {
            uint256 challengeLength;
            (challengeStart, challengeLength) = ChallengeLib.extractChallengeSegment(selection);
            require(challengeLength == 1, "TOO_LONG");
        }

        bytes32 afterHash = getOsp(challenge.wasmModuleRoot).proveOneStep(
            ExecutionContext({maxInboxMessagesRead: challenge.maxInboxMessages, bridge: bridge}),
            challengeStart,
            selection.oldSegments[selection.challengePosition],
            proof
        );
        require(
            afterHash != selection.oldSegments[selection.challengePosition + 1],
            "SAME_OSP_END"
        );

        emit OneStepProofCompleted(challengeIndex);
        _currentWin(challengeIndex, ChallengeTerminationType.EXECUTION_PROOF);
    }

    function timeout(uint64 challengeIndex) external override {
        require(challenges[challengeIndex].mode != ChallengeLib.ChallengeMode.NONE, NO_CHAL);
        require(isTimedOut(challengeIndex), "TIMEOUT_DEADLINE");
        _nextWin(challengeIndex, ChallengeTerminationType.TIMEOUT);
    }

    function clearChallenge(uint64 challengeIndex) external override {
        require(msg.sender == address(resultReceiver), "NOT_RES_RECEIVER");
        require(challenges[challengeIndex].mode != ChallengeLib.ChallengeMode.NONE, NO_CHAL);
        delete challenges[challengeIndex];
        emit ChallengeEnded(challengeIndex, ChallengeTerminationType.CLEARED);
    }

    function currentResponder(uint64 challengeIndex) public view override returns (address) {
        return challenges[challengeIndex].current.addr;
    }

    function isTimedOut(uint64 challengeIndex) public view virtual override returns (bool) {
        return challenges[challengeIndex].isTimedOut();
    }

    function requireValidBisection(
        ChallengeLib.SegmentSelection calldata selection,
        bytes32 startHash,
        bytes32 endHash
    ) private pure {
        require(selection.oldSegments[selection.challengePosition] == startHash, "WRONG_START");
        require(selection.oldSegments[selection.challengePosition + 1] != endHash, "SAME_END");
    }

    function completeBisection(
        uint64 challengeIndex,
        uint256 challengeStart,
        uint256 challengeLength,
        bytes32[] memory newSegments
    ) private {
        assert(challengeLength >= 1);
        assert(newSegments.length >= 2);

        bytes32 challengeStateHash = ChallengeLib.hashChallengeState(
            challengeStart,
            challengeLength,
            newSegments
        );
        challenges[challengeIndex].challengeStateHash = challengeStateHash;

        emit Bisected(
            challengeIndex,
            challengeStateHash,
            challengeStart,
            challengeLength,
            newSegments
        );
    }

    /// @dev This function causes the mode of the challenge to be set to NONE by deleting the challenge
    function _nextWin(uint64 challengeIndex, ChallengeTerminationType reason) private {
        ChallengeLib.Challenge storage challenge = challenges[challengeIndex];
        address next = challenge.next.addr;
        address current = challenge.current.addr;
        delete challenges[challengeIndex];
        resultReceiver.completeChallenge(challengeIndex, next, current);
        emit ChallengeEnded(challengeIndex, reason);
    }

    /**
     * @dev this currently sets a challenge hash of 0 - no move is possible for the next participant to progress the
     * state. It is assumed that wherever this function is consumed, the turn is then adjusted for the opposite party
     * to timeout. This is done as a safety measure so challenges can only be resolved by timeouts during mainnet beta.
     */
    function _currentWin(
        uint64 challengeIndex,
        ChallengeTerminationType /* reason */
    ) private {
        ChallengeLib.Challenge storage challenge = challenges[challengeIndex];
        challenge.challengeStateHash = bytes32(0);

        //        address next = challenge.next.addr;
        //        address current = challenge.current.addr;
        //        delete challenges[challengeIndex];
        //        resultReceiver.completeChallenge(challengeIndex, current, next);
        //        emit ChallengeEnded(challengeIndex, reason);
    }
}