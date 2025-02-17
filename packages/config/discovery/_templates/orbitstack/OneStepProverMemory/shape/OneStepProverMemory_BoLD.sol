// SPDX-License-Identifier: Unknown
pragma solidity 0.8.17;

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

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
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

library ModuleMemoryLib {
    using MerkleProofLib for MerkleProof;

    uint256 private constant LEAF_SIZE = 32;

    function hash(
        ModuleMemory memory mem
    ) internal pure returns (bytes32) {
        return ModuleMemoryCompactLib.hash(mem);
    }

    function proveLeaf(
        ModuleMemory memory mem,
        uint256 leafIdx,
        bytes calldata proof,
        uint256 startOffset
    ) internal pure returns (bytes32 contents, uint256 offset, MerkleProof memory merkle) {
        offset = startOffset;
        (contents, offset) = Deserialize.b32(proof, offset);
        (merkle, offset) = Deserialize.merkleProof(proof, offset);
        bytes32 recomputedRoot = merkle.computeRootFromMemory(leafIdx, contents);
        require(recomputedRoot == mem.merkleRoot, "WRONG_MEM_ROOT");
    }

    function isValidLeaf(ModuleMemory memory mem, uint256 pointer) internal pure returns (bool) {
        return pointer + 32 <= mem.size && pointer % LEAF_SIZE == 0;
    }

    function pullLeafByte(bytes32 leaf, uint256 idx) internal pure returns (uint8) {
        require(idx < LEAF_SIZE, "BAD_PULL_LEAF_BYTE_IDX");
        // Take into account that we are casting the leaf to a big-endian integer
        uint256 leafShift = (LEAF_SIZE - 1 - idx) * 8;
        return uint8(uint256(leaf) >> leafShift);
    }

    // loads a big-endian value from memory
    function load(
        ModuleMemory memory mem,
        uint256 start,
        uint256 width,
        bytes calldata proof,
        uint256 proofOffset
    ) internal pure returns (bool err, uint256 value, uint256 offset) {
        if (start + width > mem.size) {
            return (true, 0, proofOffset);
        }

        uint256 lastProvedLeafIdx = ~uint256(0);
        bytes32 lastProvedLeafContents;
        uint256 readValue;
        for (uint256 i = 0; i < width; i++) {
            uint256 idx = start + i;
            uint256 leafIdx = idx / LEAF_SIZE;
            if (leafIdx != lastProvedLeafIdx) {
                (lastProvedLeafContents, proofOffset,) = proveLeaf(mem, leafIdx, proof, proofOffset);
                lastProvedLeafIdx = leafIdx;
            }
            uint256 indexWithinLeaf = idx % LEAF_SIZE;
            readValue |= uint256(pullLeafByte(lastProvedLeafContents, indexWithinLeaf)) << (i * 8);
        }
        return (false, readValue, proofOffset);
    }
}

library ModuleMemoryCompactLib {
    function hash(
        ModuleMemory memory mem
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Memory:", mem.size, mem.maxSize, mem.merkleRoot));
    }
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

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED
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

enum ValueType {
    I32,
    I64,
    F32,
    F64,
    REF_NULL,
    FUNC_REF,
    INTERNAL_REF
}

struct Value {
    ValueType valueType;
    uint256 contents;
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

struct Instruction {
    uint16 opcode;
    uint256 argumentData;
}

abstract contract IOneStepProver {
    function executeOneStep(
        ExecutionContext memory execCtx,
        Machine calldata mach,
        Module calldata mod,
        Instruction calldata instruction,
        bytes calldata proof
    ) external view virtual returns (Machine memory result, Module memory resultMod);
}

contract OneStepProverMemory is IOneStepProver {
    using MerkleProofLib for MerkleProof;
    using ModuleMemoryLib for ModuleMemory;
    using ValueLib for Value;
    using ValueStackLib for ValueStack;

    uint256 private constant LEAF_SIZE = 32;
    uint64 private constant PAGE_SIZE = 65536;

    function setLeafByte(bytes32 oldLeaf, uint256 idx, uint8 val) internal pure returns (bytes32) {
        require(idx < LEAF_SIZE, "BAD_SET_LEAF_BYTE_IDX");
        // Take into account that we are casting the leaf to a big-endian integer
        uint256 leafShift = (LEAF_SIZE - 1 - idx) * 8;
        uint256 newLeaf = uint256(oldLeaf);
        newLeaf &= ~(0xFF << leafShift);
        newLeaf |= uint256(val) << leafShift;
        return bytes32(newLeaf);
    }

    function executeMemoryLoad(
        Machine memory mach,
        Module memory mod,
        Instruction calldata inst,
        bytes calldata proof
    ) internal pure {
        ValueType ty;
        uint256 readBytes;
        bool signed;
        if (inst.opcode == Instructions.I32_LOAD) {
            ty = ValueType.I32;
            readBytes = 4;
            signed = false;
        } else if (inst.opcode == Instructions.I64_LOAD) {
            ty = ValueType.I64;
            readBytes = 8;
            signed = false;
        } else if (inst.opcode == Instructions.F32_LOAD) {
            ty = ValueType.F32;
            readBytes = 4;
            signed = false;
        } else if (inst.opcode == Instructions.F64_LOAD) {
            ty = ValueType.F64;
            readBytes = 8;
            signed = false;
        } else if (inst.opcode == Instructions.I32_LOAD8_S) {
            ty = ValueType.I32;
            readBytes = 1;
            signed = true;
        } else if (inst.opcode == Instructions.I32_LOAD8_U) {
            ty = ValueType.I32;
            readBytes = 1;
            signed = false;
        } else if (inst.opcode == Instructions.I32_LOAD16_S) {
            ty = ValueType.I32;
            readBytes = 2;
            signed = true;
        } else if (inst.opcode == Instructions.I32_LOAD16_U) {
            ty = ValueType.I32;
            readBytes = 2;
            signed = false;
        } else if (inst.opcode == Instructions.I64_LOAD8_S) {
            ty = ValueType.I64;
            readBytes = 1;
            signed = true;
        } else if (inst.opcode == Instructions.I64_LOAD8_U) {
            ty = ValueType.I64;
            readBytes = 1;
            signed = false;
        } else if (inst.opcode == Instructions.I64_LOAD16_S) {
            ty = ValueType.I64;
            readBytes = 2;
            signed = true;
        } else if (inst.opcode == Instructions.I64_LOAD16_U) {
            ty = ValueType.I64;
            readBytes = 2;
            signed = false;
        } else if (inst.opcode == Instructions.I64_LOAD32_S) {
            ty = ValueType.I64;
            readBytes = 4;
            signed = true;
        } else if (inst.opcode == Instructions.I64_LOAD32_U) {
            ty = ValueType.I64;
            readBytes = 4;
            signed = false;
        } else {
            revert("INVALID_MEMORY_LOAD_OPCODE");
        }

        uint256 index = inst.argumentData + mach.valueStack.pop().assumeI32();
        (bool err, uint256 value,) = mod.moduleMemory.load(index, readBytes, proof, 0);
        if (err) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        uint64 readValue = uint64(value);

        if (signed) {
            // Go down to the original uint size, change to signed, go up to correct size, convert back to unsigned
            if (readBytes == 1 && ty == ValueType.I32) {
                readValue = uint32(int32(int8(uint8(readValue))));
            } else if (readBytes == 1 && ty == ValueType.I64) {
                readValue = uint64(int64(int8(uint8(readValue))));
            } else if (readBytes == 2 && ty == ValueType.I32) {
                readValue = uint32(int32(int16(uint16(readValue))));
            } else if (readBytes == 2 && ty == ValueType.I64) {
                readValue = uint64(int64(int16(uint16(readValue))));
            } else if (readBytes == 4 && ty == ValueType.I64) {
                readValue = uint64(int64(int32(uint32(readValue))));
            } else {
                revert("BAD_READ_BYTES_SIGNED");
            }
        }

        mach.valueStack.push(Value({valueType: ty, contents: readValue}));
    }

    function executeMemoryStore(
        Machine memory mach,
        Module memory mod,
        Instruction calldata inst,
        bytes calldata proof
    ) internal pure {
        uint64 writeBytes;
        uint64 toWrite;
        {
            ValueType ty;
            if (inst.opcode == Instructions.I32_STORE) {
                ty = ValueType.I32;
                writeBytes = 4;
            } else if (inst.opcode == Instructions.I64_STORE) {
                ty = ValueType.I64;
                writeBytes = 8;
            } else if (inst.opcode == Instructions.F32_STORE) {
                ty = ValueType.F32;
                writeBytes = 4;
            } else if (inst.opcode == Instructions.F64_STORE) {
                ty = ValueType.F64;
                writeBytes = 8;
            } else if (inst.opcode == Instructions.I32_STORE8) {
                ty = ValueType.I32;
                writeBytes = 1;
            } else if (inst.opcode == Instructions.I32_STORE16) {
                ty = ValueType.I32;
                writeBytes = 2;
            } else if (inst.opcode == Instructions.I64_STORE8) {
                ty = ValueType.I64;
                writeBytes = 1;
            } else if (inst.opcode == Instructions.I64_STORE16) {
                ty = ValueType.I64;
                writeBytes = 2;
            } else if (inst.opcode == Instructions.I64_STORE32) {
                ty = ValueType.I64;
                writeBytes = 4;
            } else {
                revert("INVALID_MEMORY_STORE_OPCODE");
            }

            Value memory writingVal = mach.valueStack.pop();
            require(writingVal.valueType == ty, "BAD_STORE_TYPE");
            toWrite = uint64(writingVal.contents);
            if (writeBytes < 8) {
                toWrite &= (uint64(1) << (writeBytes * 8)) - 1;
            }
        }

        // Neither of these can overflow as they're computed with much less than 256 bit integers.
        uint256 startIdx = inst.argumentData + mach.valueStack.pop().assumeI32();
        if (startIdx + writeBytes > mod.moduleMemory.size) {
            mach.status = MachineStatus.ERRORED;
            return;
        }

        uint256 proofOffset = 0;
        uint256 lastProvedLeafIdx = ~uint256(0);
        MerkleProof memory lastProvedMerkle;
        bytes32 lastProvedLeafContents;
        for (uint256 i = 0; i < writeBytes; i++) {
            uint256 idx = startIdx + i;
            uint256 leafIdx = idx / LEAF_SIZE;
            if (leafIdx != lastProvedLeafIdx) {
                if (lastProvedLeafIdx != ~uint256(0)) {
                    // Apply the last leaf update
                    mod.moduleMemory.merkleRoot = lastProvedMerkle.computeRootFromMemory(
                        lastProvedLeafIdx, lastProvedLeafContents
                    );
                }
                // This hits the stack size if we phrase it as mod.moduleMemory.proveLeaf(...)
                (lastProvedLeafContents, proofOffset, lastProvedMerkle) =
                    ModuleMemoryLib.proveLeaf(mod.moduleMemory, leafIdx, proof, proofOffset);
                lastProvedLeafIdx = leafIdx;
            }
            uint256 indexWithinLeaf = idx % LEAF_SIZE;
            lastProvedLeafContents =
                setLeafByte(lastProvedLeafContents, indexWithinLeaf, uint8(toWrite));
            toWrite >>= 8;
        }
        mod.moduleMemory.merkleRoot =
            lastProvedMerkle.computeRootFromMemory(lastProvedLeafIdx, lastProvedLeafContents);
    }

    function executeMemorySize(
        Machine memory mach,
        Module memory mod,
        Instruction calldata,
        bytes calldata
    ) internal pure {
        uint32 pages = uint32(mod.moduleMemory.size / PAGE_SIZE);
        mach.valueStack.push(ValueLib.newI32(pages));
    }

    function executeMemoryGrow(
        Machine memory mach,
        Module memory mod,
        Instruction calldata,
        bytes calldata
    ) internal pure {
        uint32 oldPages = uint32(mod.moduleMemory.size / PAGE_SIZE);
        uint32 growingPages = mach.valueStack.pop().assumeI32();
        // Safe as the input integers are too small to overflow a uint256
        uint256 newSize = uint256(oldPages) + uint256(growingPages);
        if (newSize <= mod.moduleMemory.maxSize) {
            mod.moduleMemory.size = uint64(newSize * PAGE_SIZE);
            mach.valueStack.push(ValueLib.newI32(oldPages));
        } else {
            mach.valueStack.push(ValueLib.newI32(~uint32(0)));
        }
    }

    function executeOneStep(
        ExecutionContext calldata,
        Machine calldata startMach,
        Module calldata startMod,
        Instruction calldata inst,
        bytes calldata proof
    ) external pure override returns (Machine memory mach, Module memory mod) {
        mach = startMach;
        mod = startMod;

        uint16 opcode = inst.opcode;

        function(Machine memory, Module memory, Instruction calldata, bytes calldata)
            internal
            pure impl;
        if (opcode >= Instructions.I32_LOAD && opcode <= Instructions.I64_LOAD32_U) {
            impl = executeMemoryLoad;
        } else if (opcode >= Instructions.I32_STORE && opcode <= Instructions.I64_STORE32) {
            impl = executeMemoryStore;
        } else if (opcode == Instructions.MEMORY_SIZE) {
            impl = executeMemorySize;
        } else if (opcode == Instructions.MEMORY_GROW) {
            impl = executeMemoryGrow;
        } else {
            revert("INVALID_MEMORY_OPCODE");
        }

        impl(mach, mod, inst, proof);
    }
}