// SPDX-License-Identifier: Unknown
pragma solidity 0.8.17;

library OneStepProofEntryLib {
    uint256 internal constant MAX_STEPS = 1 << 43;
}

library Deserialize {
    function u8(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (uint8 ret, uint256 offset) {
        offset = startOffset;
        ret = uint8(proof[offset]);
        offset++;
    }

    function u16(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (uint16 ret, uint256 offset) {
        offset = startOffset;
        for (uint256 i = 0; i < 16 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function u32(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (uint32 ret, uint256 offset) {
        offset = startOffset;
        for (uint256 i = 0; i < 32 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function u64(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (uint64 ret, uint256 offset) {
        offset = startOffset;
        for (uint256 i = 0; i < 64 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function u256(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (uint256 ret, uint256 offset) {
        offset = startOffset;
        for (uint256 i = 0; i < 256 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function b32(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (bytes32 ret, uint256 offset) {
        offset = startOffset;
        uint256 retInt;
        (retInt, offset) = u256(proof, offset);
        ret = bytes32(retInt);
    }

    function boolean(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (bool ret, uint256 offset) {
        offset = startOffset;
        ret = uint8(proof[offset]) != 0;
        offset++;
    }

    function value(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (Value memory val, uint256 offset) {
        offset = startOffset;
        uint8 typeInt = uint8(proof[offset]);
        offset++;
        require(typeInt <= uint8(ValueLib.maxValueType()), "BAD_VALUE_TYPE");
        uint256 contents;
        (contents, offset) = u256(proof, offset);
        val = Value({valueType: ValueType(typeInt), contents: contents});
    }

    function valueStack(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (ValueStack memory stack, uint256 offset) {
        offset = startOffset;
        bytes32 remainingHash;
        (remainingHash, offset) = b32(proof, offset);
        uint256 provedLength;
        (provedLength, offset) = u256(proof, offset);
        Value[] memory proved = new Value[](provedLength);
        for (uint256 i = 0; i < proved.length; i++) {
            (proved[i], offset) = value(proof, offset);
        }
        stack = ValueStack({proved: ValueArray(proved), remainingHash: remainingHash});
    }

    function multiStack(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (MultiStack memory multistack, uint256 offset) {
        offset = startOffset;
        bytes32 inactiveStackHash;
        (inactiveStackHash, offset) = b32(proof, offset);
        bytes32 remainingHash;
        (remainingHash, offset) = b32(proof, offset);
        multistack =
            MultiStack({inactiveStackHash: inactiveStackHash, remainingHash: remainingHash});
    }

    function instructions(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (Instruction[] memory code, uint256 offset) {
        offset = startOffset;
        uint8 count;
        (count, offset) = u8(proof, offset);
        code = new Instruction[](count);

        for (uint256 i = 0; i < uint256(count); i++) {
            uint16 opcode;
            uint256 data;
            (opcode, offset) = u16(proof, offset);
            (data, offset) = u256(proof, offset);
            code[i] = Instruction({opcode: opcode, argumentData: data});
        }
    }

    function stackFrame(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (StackFrame memory window, uint256 offset) {
        offset = startOffset;
        Value memory returnPc;
        bytes32 localsMerkleRoot;
        uint32 callerModule;
        uint32 callerModuleInternals;
        (returnPc, offset) = value(proof, offset);
        (localsMerkleRoot, offset) = b32(proof, offset);
        (callerModule, offset) = u32(proof, offset);
        (callerModuleInternals, offset) = u32(proof, offset);
        window = StackFrame({
            returnPc: returnPc,
            localsMerkleRoot: localsMerkleRoot,
            callerModule: callerModule,
            callerModuleInternals: callerModuleInternals
        });
    }

    function stackFrameWindow(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (StackFrameWindow memory window, uint256 offset) {
        offset = startOffset;
        bytes32 remainingHash;
        (remainingHash, offset) = b32(proof, offset);
        StackFrame[] memory proved;
        if (proof[offset] != 0) {
            offset++;
            proved = new StackFrame[](1);
            (proved[0], offset) = stackFrame(proof, offset);
        } else {
            offset++;
            proved = new StackFrame[](0);
        }
        window = StackFrameWindow({proved: proved, remainingHash: remainingHash});
    }

    function moduleMemory(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (ModuleMemory memory mem, uint256 offset) {
        offset = startOffset;
        uint64 size;
        uint64 maxSize;
        bytes32 root;
        (size, offset) = u64(proof, offset);
        (maxSize, offset) = u64(proof, offset);
        (root, offset) = b32(proof, offset);
        mem = ModuleMemory({size: size, maxSize: maxSize, merkleRoot: root});
    }

    function module(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (Module memory mod, uint256 offset) {
        offset = startOffset;
        bytes32 globalsMerkleRoot;
        ModuleMemory memory mem;
        bytes32 tablesMerkleRoot;
        bytes32 functionsMerkleRoot;
        bytes32 extraHash;
        uint32 internalsOffset;
        (globalsMerkleRoot, offset) = b32(proof, offset);
        (mem, offset) = moduleMemory(proof, offset);
        (tablesMerkleRoot, offset) = b32(proof, offset);
        (functionsMerkleRoot, offset) = b32(proof, offset);
        (extraHash, offset) = b32(proof, offset);
        (internalsOffset, offset) = u32(proof, offset);
        mod = Module({
            globalsMerkleRoot: globalsMerkleRoot,
            moduleMemory: mem,
            tablesMerkleRoot: tablesMerkleRoot,
            functionsMerkleRoot: functionsMerkleRoot,
            extraHash: extraHash,
            internalsOffset: internalsOffset
        });
    }

    function globalState(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (GlobalState memory state, uint256 offset) {
        offset = startOffset;

        // using constant ints for array size requires newer solidity
        bytes32[2] memory bytes32Vals;
        uint64[2] memory u64Vals;

        for (uint8 i = 0; i < GlobalStateLib.BYTES32_VALS_NUM; i++) {
            (bytes32Vals[i], offset) = b32(proof, offset);
        }
        for (uint8 i = 0; i < GlobalStateLib.U64_VALS_NUM; i++) {
            (u64Vals[i], offset) = u64(proof, offset);
        }
        state = GlobalState({bytes32Vals: bytes32Vals, u64Vals: u64Vals});
    }

    function machine(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (Machine memory mach, uint256 offset) {
        offset = startOffset;
        {
            MachineStatus status;
            {
                uint8 statusU8;
                (statusU8, offset) = u8(proof, offset);
                if (statusU8 == 0) {
                    status = MachineStatus.RUNNING;
                } else if (statusU8 == 1) {
                    status = MachineStatus.FINISHED;
                } else if (statusU8 == 2) {
                    status = MachineStatus.ERRORED;
                } else {
                    revert("UNKNOWN_MACH_STATUS");
                }
            }
            ValueStack memory values;
            ValueStack memory internalStack;
            MultiStack memory valuesMulti;
            StackFrameWindow memory frameStack;
            MultiStack memory framesMulti;
            (values, offset) = valueStack(proof, offset);
            (valuesMulti, offset) = multiStack(proof, offset);
            (internalStack, offset) = valueStack(proof, offset);
            (frameStack, offset) = stackFrameWindow(proof, offset);
            (framesMulti, offset) = multiStack(proof, offset);
            mach = Machine({
                status: status,
                valueStack: values,
                valueMultiStack: valuesMulti,
                internalStack: internalStack,
                frameStack: frameStack,
                frameMultiStack: framesMulti,
                globalStateHash: bytes32(0), // filled later
                moduleIdx: 0, // filled later
                functionIdx: 0, // filled later
                functionPc: 0, // filled later
                recoveryPc: bytes32(0), // filled later
                modulesRoot: bytes32(0) // filled later
            });
        }
        (mach.globalStateHash, offset) = b32(proof, offset);
        (mach.moduleIdx, offset) = u32(proof, offset);
        (mach.functionIdx, offset) = u32(proof, offset);
        (mach.functionPc, offset) = u32(proof, offset);
        (mach.recoveryPc, offset) = b32(proof, offset);
        (mach.modulesRoot, offset) = b32(proof, offset);
    }

    function merkleProof(
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (MerkleProof memory merkle, uint256 offset) {
        offset = startOffset;
        uint8 length;
        (length, offset) = u8(proof, offset);
        bytes32[] memory counterparts = new bytes32[](length);
        for (uint8 i = 0; i < length; i++) {
            (counterparts[i], offset) = b32(proof, offset);
        }
        merkle = MerkleProof(counterparts);
    }
}

library GlobalStateLib {
    using GlobalStateLib for GlobalState;

    uint16 internal constant BYTES32_VALS_NUM = 2;
    uint16 internal constant U64_VALS_NUM = 2;

    function hash(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "Global state:",
                state.bytes32Vals[0],
                state.bytes32Vals[1],
                state.u64Vals[0],
                state.u64Vals[1]
            )
        );
    }

    function getBlockHash(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return state.bytes32Vals[0];
    }

    function getSendRoot(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return state.bytes32Vals[1];
    }

    function getInboxPosition(
        GlobalState memory state
    ) internal pure returns (uint64) {
        return state.u64Vals[0];
    }

    function getPositionInMessage(
        GlobalState memory state
    ) internal pure returns (uint64) {
        return state.u64Vals[1];
    }

    function isEmpty(
        GlobalState calldata state
    ) internal pure returns (bool) {
        return (
            state.bytes32Vals[0] == bytes32(0) && state.bytes32Vals[1] == bytes32(0)
                && state.u64Vals[0] == 0 && state.u64Vals[1] == 0
        );
    }

    function comparePositions(
        GlobalState calldata a,
        GlobalState calldata b
    ) internal pure returns (int256) {
        uint64 aPos = a.getInboxPosition();
        uint64 bPos = b.getInboxPosition();
        if (aPos < bPos) {
            return -1;
        } else if (aPos > bPos) {
            return 1;
        } else {
            uint64 aMsg = a.getPositionInMessage();
            uint64 bMsg = b.getPositionInMessage();
            if (aMsg < bMsg) {
                return -1;
            } else if (aMsg > bMsg) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function comparePositionsAgainstStartOfBatch(
        GlobalState calldata a,
        uint256 bPos
    ) internal pure returns (int256) {
        uint64 aPos = a.getInboxPosition();
        if (aPos < bPos) {
            return -1;
        } else if (aPos > bPos) {
            return 1;
        } else {
            if (a.getPositionInMessage() > 0) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

library StackFrameLib {
    using ValueLib for Value;

    function hash(
        StackFrame memory frame
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "Stack frame:",
                frame.returnPc.hash(),
                frame.localsMerkleRoot,
                frame.callerModule,
                frame.callerModuleInternals
            )
        );
    }

    function hash(
        StackFrameWindow memory window
    ) internal pure returns (bytes32 h) {
        h = window.remainingHash;
        for (uint256 i = 0; i < window.proved.length; i++) {
            h = keccak256(abi.encodePacked("Stack frame stack:", hash(window.proved[i]), h));
        }
    }

    function peek(
        StackFrameWindow memory window
    ) internal pure returns (StackFrame memory) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        return window.proved[0];
    }

    function pop(
        StackFrameWindow memory window
    ) internal pure returns (StackFrame memory frame) {
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

library ValueArrayLib {
    function get(ValueArray memory arr, uint256 index) internal pure returns (Value memory) {
        return arr.inner[index];
    }

    function set(ValueArray memory arr, uint256 index, Value memory val) internal pure {
        arr.inner[index] = val;
    }

    function length(
        ValueArray memory arr
    ) internal pure returns (uint256) {
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

    function pop(
        ValueArray memory arr
    ) internal pure returns (Value memory popped) {
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

    function hash(
        ValueStack memory stack
    ) internal pure returns (bytes32 h) {
        h = stack.remainingHash;
        uint256 len = stack.proved.length();
        for (uint256 i = 0; i < len; i++) {
            h = keccak256(abi.encodePacked("Value stack:", stack.proved.get(i).hash(), h));
        }
    }

    function peek(
        ValueStack memory stack
    ) internal pure returns (Value memory) {
        uint256 len = stack.proved.length();
        return stack.proved.get(len - 1);
    }

    function pop(
        ValueStack memory stack
    ) internal pure returns (Value memory) {
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
            return keccak256(
                abi.encodePacked(
                    "multistack:", multi.inactiveStackHash, activeStackHash, multi.remainingHash
                )
            );
        } else {
            return keccak256(
                abi.encodePacked(
                    "multistack:", activeStackHash, multi.inactiveStackHash, multi.remainingHash
                )
            );
        }
    }

    function setEmpty(
        MultiStack memory multi
    ) internal pure {
        multi.inactiveStackHash = NO_STACK_HASH;
        multi.remainingHash = 0;
    }

    function pushNew(
        MultiStack memory multi
    ) internal pure {
        if (multi.inactiveStackHash != NO_STACK_HASH) {
            multi.remainingHash = keccak256(
                abi.encodePacked("cothread:", multi.inactiveStackHash, multi.remainingHash)
            );
        }
        multi.inactiveStackHash = 0;
    }
}

library MachineLib {
    using StackFrameLib for StackFrameWindow;
    using ValueStackLib for ValueStack;
    using MultiStackLib for MultiStack;

    bytes32 internal constant NO_RECOVERY_PC = ~bytes32(0);

    function hash(
        Machine memory mach
    ) internal pure returns (bytes32) {
        // Warning: the non-running hashes are replicated in Challenge
        if (mach.status == MachineStatus.RUNNING) {
            bytes32 valueMultiHash =
                mach.valueMultiStack.hash(mach.valueStack.hash(), mach.recoveryPc != NO_RECOVERY_PC);
            bytes32 frameMultiHash =
                mach.frameMultiStack.hash(mach.frameStack.hash(), mach.recoveryPc != NO_RECOVERY_PC);
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
            return keccak256(abi.encodePacked("Machine errored:", mach.globalStateHash));
        } else {
            revert("BAD_MACH_STATUS");
        }
    }

    function switchCoThreadStacks(
        Machine memory mach
    ) internal pure {
        bytes32 newActiveValue = mach.valueMultiStack.inactiveStackHash;
        bytes32 newActiveFrame = mach.frameMultiStack.inactiveStackHash;
        if (
            newActiveFrame == MultiStackLib.NO_STACK_HASH
                || newActiveValue == MultiStackLib.NO_STACK_HASH
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

    function setPcFromRecovery(
        Machine memory mach
    ) internal pure returns (bool) {
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

library ModuleMemoryCompactLib {
    function hash(
        ModuleMemory memory mem
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Memory:", mem.size, mem.maxSize, mem.merkleRoot));
    }
}

struct ModuleMemory {
    uint64 size;
    uint64 maxSize;
    bytes32 merkleRoot;
}

struct Module {
    bytes32 globalsMerkleRoot;
    ModuleMemory moduleMemory;
    bytes32 tablesMerkleRoot;
    bytes32 functionsMerkleRoot;
    bytes32 extraHash;
    uint32 internalsOffset;
}

library ModuleLib {
    using ModuleMemoryCompactLib for ModuleMemory;

    function hash(
        Module memory mod
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "Module:",
                mod.globalsMerkleRoot,
                mod.moduleMemory.hash(),
                mod.tablesMerkleRoot,
                mod.functionsMerkleRoot,
                mod.extraHash,
                mod.internalsOffset
            )
        );
    }
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

library ValueLib {
    function hash(
        Value memory val
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Value:", val.valueType, val.contents));
    }

    function maxValueType() internal pure returns (ValueType) {
        return ValueType.INTERNAL_REF;
    }

    function assumeI32(
        Value memory val
    ) internal pure returns (uint32) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I32, "NOT_I32");
        require(uintval < (1 << 32), "BAD_I32");
        return uint32(uintval);
    }

    function assumeI64(
        Value memory val
    ) internal pure returns (uint64) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I64, "NOT_I64");
        require(uintval < (1 << 64), "BAD_I64");
        return uint64(uintval);
    }

    function newRefNull() internal pure returns (Value memory) {
        return Value({valueType: ValueType.REF_NULL, contents: 0});
    }

    function newI32(
        uint32 x
    ) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I32, contents: uint256(x)});
    }

    function newI64(
        uint64 x
    ) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I64, contents: uint256(x)});
    }

    function newBoolean(
        bool x
    ) internal pure returns (Value memory) {
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

struct Instruction {
    uint16 opcode;
    uint256 argumentData;
}

library Instructions {
    uint16 internal constant UNREACHABLE = 0x00;
    uint16 internal constant NOP = 0x01;
    uint16 internal constant RETURN = 0x0F;
    uint16 internal constant CALL = 0x10;
    uint16 internal constant CALL_INDIRECT = 0x11;
    uint16 internal constant LOCAL_GET = 0x20;
    uint16 internal constant LOCAL_SET = 0x21;
    uint16 internal constant GLOBAL_GET = 0x23;
    uint16 internal constant GLOBAL_SET = 0x24;

    uint16 internal constant I32_LOAD = 0x28;
    uint16 internal constant I64_LOAD = 0x29;
    uint16 internal constant F32_LOAD = 0x2A;
    uint16 internal constant F64_LOAD = 0x2B;
    uint16 internal constant I32_LOAD8_S = 0x2C;
    uint16 internal constant I32_LOAD8_U = 0x2D;
    uint16 internal constant I32_LOAD16_S = 0x2E;
    uint16 internal constant I32_LOAD16_U = 0x2F;
    uint16 internal constant I64_LOAD8_S = 0x30;
    uint16 internal constant I64_LOAD8_U = 0x31;
    uint16 internal constant I64_LOAD16_S = 0x32;
    uint16 internal constant I64_LOAD16_U = 0x33;
    uint16 internal constant I64_LOAD32_S = 0x34;
    uint16 internal constant I64_LOAD32_U = 0x35;

    uint16 internal constant I32_STORE = 0x36;
    uint16 internal constant I64_STORE = 0x37;
    uint16 internal constant F32_STORE = 0x38;
    uint16 internal constant F64_STORE = 0x39;
    uint16 internal constant I32_STORE8 = 0x3A;
    uint16 internal constant I32_STORE16 = 0x3B;
    uint16 internal constant I64_STORE8 = 0x3C;
    uint16 internal constant I64_STORE16 = 0x3D;
    uint16 internal constant I64_STORE32 = 0x3E;

    uint16 internal constant MEMORY_SIZE = 0x3F;
    uint16 internal constant MEMORY_GROW = 0x40;

    uint16 internal constant DROP = 0x1A;
    uint16 internal constant SELECT = 0x1B;
    uint16 internal constant I32_CONST = 0x41;
    uint16 internal constant I64_CONST = 0x42;
    uint16 internal constant F32_CONST = 0x43;
    uint16 internal constant F64_CONST = 0x44;
    uint16 internal constant I32_EQZ = 0x45;
    uint16 internal constant I32_RELOP_BASE = 0x46;
    uint16 internal constant IRELOP_EQ = 0;
    uint16 internal constant IRELOP_NE = 1;
    uint16 internal constant IRELOP_LT_S = 2;
    uint16 internal constant IRELOP_LT_U = 3;
    uint16 internal constant IRELOP_GT_S = 4;
    uint16 internal constant IRELOP_GT_U = 5;
    uint16 internal constant IRELOP_LE_S = 6;
    uint16 internal constant IRELOP_LE_U = 7;
    uint16 internal constant IRELOP_GE_S = 8;
    uint16 internal constant IRELOP_GE_U = 9;
    uint16 internal constant IRELOP_LAST = IRELOP_GE_U;

    uint16 internal constant I64_EQZ = 0x50;
    uint16 internal constant I64_RELOP_BASE = 0x51;

    uint16 internal constant I32_UNOP_BASE = 0x67;
    uint16 internal constant IUNOP_CLZ = 0;
    uint16 internal constant IUNOP_CTZ = 1;
    uint16 internal constant IUNOP_POPCNT = 2;
    uint16 internal constant IUNOP_LAST = IUNOP_POPCNT;

    uint16 internal constant I32_ADD = 0x6A;
    uint16 internal constant I32_SUB = 0x6B;
    uint16 internal constant I32_MUL = 0x6C;
    uint16 internal constant I32_DIV_S = 0x6D;
    uint16 internal constant I32_DIV_U = 0x6E;
    uint16 internal constant I32_REM_S = 0x6F;
    uint16 internal constant I32_REM_U = 0x70;
    uint16 internal constant I32_AND = 0x71;
    uint16 internal constant I32_OR = 0x72;
    uint16 internal constant I32_XOR = 0x73;
    uint16 internal constant I32_SHL = 0x74;
    uint16 internal constant I32_SHR_S = 0x75;
    uint16 internal constant I32_SHR_U = 0x76;
    uint16 internal constant I32_ROTL = 0x77;
    uint16 internal constant I32_ROTR = 0x78;

    uint16 internal constant I64_UNOP_BASE = 0x79;

    uint16 internal constant I64_ADD = 0x7C;
    uint16 internal constant I64_SUB = 0x7D;
    uint16 internal constant I64_MUL = 0x7E;
    uint16 internal constant I64_DIV_S = 0x7F;
    uint16 internal constant I64_DIV_U = 0x80;
    uint16 internal constant I64_REM_S = 0x81;
    uint16 internal constant I64_REM_U = 0x82;
    uint16 internal constant I64_AND = 0x83;
    uint16 internal constant I64_OR = 0x84;
    uint16 internal constant I64_XOR = 0x85;
    uint16 internal constant I64_SHL = 0x86;
    uint16 internal constant I64_SHR_S = 0x87;
    uint16 internal constant I64_SHR_U = 0x88;
    uint16 internal constant I64_ROTL = 0x89;
    uint16 internal constant I64_ROTR = 0x8A;

    uint16 internal constant I32_WRAP_I64 = 0xA7;
    uint16 internal constant I64_EXTEND_I32_S = 0xAC;
    uint16 internal constant I64_EXTEND_I32_U = 0xAD;

    uint16 internal constant I32_REINTERPRET_F32 = 0xBC;
    uint16 internal constant I64_REINTERPRET_F64 = 0xBD;
    uint16 internal constant F32_REINTERPRET_I32 = 0xBE;
    uint16 internal constant F64_REINTERPRET_I64 = 0xBF;

    uint16 internal constant I32_EXTEND_8S = 0xC0;
    uint16 internal constant I32_EXTEND_16S = 0xC1;
    uint16 internal constant I64_EXTEND_8S = 0xC2;
    uint16 internal constant I64_EXTEND_16S = 0xC3;
    uint16 internal constant I64_EXTEND_32S = 0xC4;

    uint16 internal constant INIT_FRAME = 0x8002;
    uint16 internal constant ARBITRARY_JUMP = 0x8003;
    uint16 internal constant ARBITRARY_JUMP_IF = 0x8004;
    uint16 internal constant MOVE_FROM_STACK_TO_INTERNAL = 0x8005;
    uint16 internal constant MOVE_FROM_INTERNAL_TO_STACK = 0x8006;
    uint16 internal constant DUP = 0x8008;
    uint16 internal constant CROSS_MODULE_CALL = 0x8009;
    uint16 internal constant CALLER_MODULE_INTERNAL_CALL = 0x800A;
    uint16 internal constant CROSS_MODULE_FORWARD = 0x800B;
    uint16 internal constant CROSS_MODULE_INTERNAL_CALL = 0x800C;

    uint16 internal constant GET_GLOBAL_STATE_BYTES32 = 0x8010;
    uint16 internal constant SET_GLOBAL_STATE_BYTES32 = 0x8011;
    uint16 internal constant GET_GLOBAL_STATE_U64 = 0x8012;
    uint16 internal constant SET_GLOBAL_STATE_U64 = 0x8013;

    uint16 internal constant READ_PRE_IMAGE = 0x8020;
    uint16 internal constant READ_INBOX_MESSAGE = 0x8021;
    uint16 internal constant HALT_AND_SET_FINISHED = 0x8022;
    uint16 internal constant LINK_MODULE = 0x8023;
    uint16 internal constant UNLINK_MODULE = 0x8024;

    uint16 internal constant NEW_COTHREAD = 0x8030;
    uint16 internal constant POP_COTHREAD = 0x8031;
    uint16 internal constant SWITCH_COTHREAD = 0x8032;

    uint256 internal constant INBOX_INDEX_SEQUENCER = 0;
    uint256 internal constant INBOX_INDEX_DELAYED = 1;

    function hash(
        Instruction[] memory code
    ) internal pure returns (bytes32) {
        // To avoid quadratic expense, we declare a `bytes` early and populate its contents.
        bytes memory data = new bytes(13 + 1 + 34 * code.length);
        assembly {
            // Represents the string "Instructions:", which we place after the length word.
            mstore(
                add(data, 32), 0x496e737472756374696f6e733a00000000000000000000000000000000000000
            )
        }

        // write the instruction count
        uint256 offset = 13;
        data[offset] = bytes1(uint8(code.length));
        offset++;

        // write each instruction
        for (uint256 i = 0; i < code.length; i++) {
            Instruction memory inst = code[i];
            data[offset] = bytes1(uint8(inst.opcode >> 8));
            data[offset + 1] = bytes1(uint8(inst.opcode));
            offset += 2;
            uint256 argumentData = inst.argumentData;
            assembly {
                mstore(add(add(data, 32), offset), argumentData)
            }
            offset += 32;
        }
        return keccak256(data);
    }
}

library MerkleProofLib {
    using ModuleLib for Module;
    using ValueLib for Value;

    function computeRootFromValue(
        MerkleProof memory proof,
        uint256 index,
        Value memory leaf
    ) internal pure returns (bytes32) {
        return computeRootUnsafe(proof, index, leaf.hash(), "Value merkle tree:");
    }

    function computeRootFromInstructions(
        MerkleProof memory proof,
        uint256 index,
        Instruction[] memory code
    ) internal pure returns (bytes32) {
        return computeRootUnsafe(proof, index, Instructions.hash(code), "Instruction merkle tree:");
    }

    function computeRootFromFunction(
        MerkleProof memory proof,
        uint256 index,
        bytes32 codeRoot
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Function:", codeRoot));
        return computeRootUnsafe(proof, index, h, "Function merkle tree:");
    }

    function computeRootFromMemory(
        MerkleProof memory proof,
        uint256 index,
        bytes32 contents
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Memory leaf:", contents));
        return computeRootUnsafe(proof, index, h, "Memory merkle tree:");
    }

    function computeRootFromElement(
        MerkleProof memory proof,
        uint256 index,
        bytes32 funcTypeHash,
        Value memory val
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Table element:", funcTypeHash, val.hash()));
        return computeRootUnsafe(proof, index, h, "Table element merkle tree:");
    }

    function computeRootFromTable(
        MerkleProof memory proof,
        uint256 index,
        uint8 tableType,
        uint64 tableSize,
        bytes32 elementsRoot
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Table:", tableType, tableSize, elementsRoot));
        return computeRootUnsafe(proof, index, h, "Table merkle tree:");
    }

    function computeRootFromModule(
        MerkleProof memory proof,
        uint256 index,
        Module memory mod
    ) internal pure returns (bytes32) {
        return computeRootUnsafe(proof, index, mod.hash(), "Module merkle tree:");
    }

    // WARNING: leafHash must be computed in such a way that it cannot be a non-leaf hash.
    function computeRootUnsafe(
        MerkleProof memory proof,
        uint256 index,
        bytes32 leafHash,
        string memory prefix
    ) internal pure returns (bytes32 h) {
        h = leafHash;
        for (uint256 layer = 0; layer < proof.counterparts.length; layer++) {
            if (index & 1 == 0) {
                h = keccak256(abi.encodePacked(prefix, h, proof.counterparts[layer]));
            } else {
                h = keccak256(abi.encodePacked(prefix, proof.counterparts[layer], h));
            }
            index >>= 1;
        }
        require(index == 0, "PROOF_TOO_SHORT");
    }

    function growToNewRoot(
        bytes32 root,
        uint256 leaf,
        bytes32 hash,
        bytes32 zero,
        string memory prefix
    ) internal pure returns (bytes32) {
        bytes32 h = hash;
        uint256 node = leaf;
        while (node > 1) {
            h = keccak256(abi.encodePacked(prefix, h, zero));
            zero = keccak256(abi.encodePacked(prefix, zero, zero));
            node >>= 1;
        }
        return keccak256(abi.encodePacked(prefix, root, h));
    }
}

struct MerkleProof {
    bytes32[] counterparts;
}

struct ExecutionContext {
    uint256 maxInboxMessagesRead;
    IBridge bridge;
    bytes32 initialWasmModuleRoot;
}

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED
}

struct ExecutionState {
    GlobalState globalState;
    MachineStatus machineStatus;
}

interface IOneStepProofEntry {
    function getStartMachineHash(
        bytes32 globalStateHash,
        bytes32 wasmModuleRoot
    ) external pure returns (bytes32);

    function proveOneStep(
        ExecutionContext calldata execCtx,
        uint256 machineStep,
        bytes32 beforeHash,
        bytes calldata proof
    ) external view returns (bytes32 afterHash);

    function getMachineHash(
        ExecutionState calldata execState
    ) external pure returns (bytes32);
}

contract OneStepProofEntry is IOneStepProofEntry {
    using MerkleProofLib for MerkleProof;
    using MachineLib for Machine;
    using GlobalStateLib for GlobalState;
    using MultiStackLib for MultiStack;

    using ValueStackLib for ValueStack;
    using StackFrameLib for StackFrameWindow;

    IOneStepProver public prover0;
    IOneStepProver public proverMem;
    IOneStepProver public proverMath;
    IOneStepProver public proverHostIo;

    constructor(
        IOneStepProver prover0_,
        IOneStepProver proverMem_,
        IOneStepProver proverMath_,
        IOneStepProver proverHostIo_
    ) {
        prover0 = prover0_;
        proverMem = proverMem_;
        proverMath = proverMath_;
        proverHostIo = proverHostIo_;
    }

    // Copied from OldChallengeLib.sol
    function getStartMachineHash(
        bytes32 globalStateHash,
        bytes32 wasmModuleRoot
    ) public pure returns (bytes32) {
        // Start the value stack with the function call ABI for the entrypoint
        Value[] memory startingValues = new Value[](3);
        startingValues[0] = ValueLib.newRefNull();
        startingValues[1] = ValueLib.newI32(0);
        startingValues[2] = ValueLib.newI32(0);
        ValueArray memory valuesArray = ValueArray({inner: startingValues});
        ValueStack memory values = ValueStack({proved: valuesArray, remainingHash: 0});
        ValueStack memory internalStack;
        StackFrameWindow memory frameStack;
        MultiStack memory emptyMultiStack;
        emptyMultiStack.setEmpty();

        Machine memory mach = Machine({
            status: MachineStatus.RUNNING,
            valueStack: values,
            valueMultiStack: emptyMultiStack,
            internalStack: internalStack,
            frameStack: frameStack,
            frameMultiStack: emptyMultiStack,
            globalStateHash: globalStateHash,
            moduleIdx: 0,
            functionIdx: 0,
            functionPc: 0,
            recoveryPc: MachineLib.NO_RECOVERY_PC,
            modulesRoot: wasmModuleRoot
        });
        return mach.hash();
    }

    function getMachineHash(
        ExecutionState calldata execState
    ) external pure override returns (bytes32) {
        if (execState.machineStatus == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Machine finished:", execState.globalState.hash()));
        } else if (execState.machineStatus == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Machine errored:", execState.globalState.hash()));
        } else {
            revert("BAD_MACHINE_STATUS");
        }
    }

    function proveOneStep(
        ExecutionContext calldata execCtx,
        uint256 machineStep,
        bytes32 beforeHash,
        bytes calldata proof
    ) external view override returns (bytes32 afterHash) {
        Machine memory mach;
        Module memory mod;
        MerkleProof memory modProof;
        Instruction memory inst;

        {
            uint256 offset = 0;
            (mach, offset) = Deserialize.machine(proof, offset);
            require(mach.hash() == beforeHash, "MACHINE_BEFORE_HASH");
            if (mach.status != MachineStatus.RUNNING) {
                // Machine is halted.
                // WARNING: at this point, most machine fields are unconstrained.
                GlobalState memory globalState;
                (globalState, offset) = Deserialize.globalState(proof, offset);
                require(globalState.hash() == mach.globalStateHash, "BAD_GLOBAL_STATE");
                if (
                    mach.status == MachineStatus.FINISHED && machineStep == 0
                        && globalState.getInboxPosition() < execCtx.maxInboxMessagesRead
                ) {
                    // Kickstart the machine
                    return getStartMachineHash(mach.globalStateHash, execCtx.initialWasmModuleRoot);
                }
                return mach.hash();
            }

            if (machineStep + 1 == OneStepProofEntryLib.MAX_STEPS) {
                mach.status = MachineStatus.ERRORED;
                return mach.hash();
            }

            (mod, offset) = Deserialize.module(proof, offset);
            (modProof, offset) = Deserialize.merkleProof(proof, offset);
            require(
                modProof.computeRootFromModule(mach.moduleIdx, mod) == mach.modulesRoot,
                "MODULES_ROOT"
            );

            {
                Instruction[] memory codeChunk;
                MerkleProof memory codeProof;
                MerkleProof memory funcProof;
                (codeChunk, offset) = Deserialize.instructions(proof, offset);
                (codeProof, offset) = Deserialize.merkleProof(proof, offset);
                (funcProof, offset) = Deserialize.merkleProof(proof, offset);
                bytes32 codeHash =
                    codeProof.computeRootFromInstructions(mach.functionPc / 64, codeChunk);
                bytes32 recomputedRoot =
                    funcProof.computeRootFromFunction(mach.functionIdx, codeHash);
                require(recomputedRoot == mod.functionsMerkleRoot, "BAD_FUNCTIONS_ROOT");
                inst = codeChunk[mach.functionPc % 64];
            }
            proof = proof[offset:];
        }

        uint256 oldModIdx = mach.moduleIdx;
        mach.functionPc += 1;
        uint16 opcode = inst.opcode;
        IOneStepProver prover;
        if (
            (opcode >= Instructions.I32_LOAD && opcode <= Instructions.I64_LOAD32_U)
                || (opcode >= Instructions.I32_STORE && opcode <= Instructions.I64_STORE32)
                || opcode == Instructions.MEMORY_SIZE || opcode == Instructions.MEMORY_GROW
        ) {
            prover = proverMem;
        } else if (
            (opcode == Instructions.I32_EQZ || opcode == Instructions.I64_EQZ)
                || (
                    opcode >= Instructions.I32_RELOP_BASE
                        && opcode <= Instructions.I32_RELOP_BASE + Instructions.IRELOP_LAST
                )
                || (
                    opcode >= Instructions.I32_UNOP_BASE
                        && opcode <= Instructions.I32_UNOP_BASE + Instructions.IUNOP_LAST
                ) || (opcode >= Instructions.I32_ADD && opcode <= Instructions.I32_ROTR)
                || (
                    opcode >= Instructions.I64_RELOP_BASE
                        && opcode <= Instructions.I64_RELOP_BASE + Instructions.IRELOP_LAST
                )
                || (
                    opcode >= Instructions.I64_UNOP_BASE
                        && opcode <= Instructions.I64_UNOP_BASE + Instructions.IUNOP_LAST
                ) || (opcode >= Instructions.I64_ADD && opcode <= Instructions.I64_ROTR)
                || (opcode == Instructions.I32_WRAP_I64)
                || (opcode == Instructions.I64_EXTEND_I32_S || opcode == Instructions.I64_EXTEND_I32_U)
                || (opcode >= Instructions.I32_EXTEND_8S && opcode <= Instructions.I64_EXTEND_32S)
                || (
                    opcode >= Instructions.I32_REINTERPRET_F32
                        && opcode <= Instructions.F64_REINTERPRET_I64
                )
        ) {
            prover = proverMath;
        } else if (
            (
                opcode >= Instructions.GET_GLOBAL_STATE_BYTES32
                    && opcode <= Instructions.SET_GLOBAL_STATE_U64
            ) || (opcode >= Instructions.READ_PRE_IMAGE && opcode <= Instructions.UNLINK_MODULE)
                || (opcode >= Instructions.NEW_COTHREAD && opcode <= Instructions.SWITCH_COTHREAD)
        ) {
            prover = proverHostIo;
        } else {
            prover = prover0;
        }

        (mach, mod) = prover.executeOneStep(execCtx, mach, mod, inst, proof);

        bool updateRoot =
            !(opcode == Instructions.LINK_MODULE || opcode == Instructions.UNLINK_MODULE);
        if (updateRoot) {
            mach.modulesRoot = modProof.computeRootFromModule(oldModIdx, mod);
        }

        if (mach.status == MachineStatus.ERRORED && mach.recoveryPc != MachineLib.NO_RECOVERY_PC) {
            // capture error, recover into main thread.
            mach.switchCoThreadStacks();
            mach.setPcFromRecovery();
            mach.status = MachineStatus.RUNNING;
        }

        return mach.hash();
    }
}