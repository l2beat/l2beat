// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

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

    function hash(Instruction[] memory code) internal pure returns (bytes32) {
        // To avoid quadratic expense, we declare a `bytes` early and populate its contents.
        bytes memory data = new bytes(13 + 1 + 34 * code.length);
        assembly {
            // Represents the string "Instructions:", which we place after the length word.
            mstore(
                add(data, 32),
                0x496e737472756374696f6e733a00000000000000000000000000000000000000
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

struct ExecutionContext {
    uint256 maxInboxMessagesRead;
    IBridge bridge;
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED,
    TOO_FAR
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

contract OneStepProverMath is IOneStepProver {
    using ValueLib for Value;
    using ValueStackLib for ValueStack;

    function executeEqz(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        Value memory v = mach.valueStack.pop();
        if (inst.opcode == Instructions.I32_EQZ) {
            require(v.valueType == ValueType.I32, "NOT_I32");
        } else if (inst.opcode == Instructions.I64_EQZ) {
            require(v.valueType == ValueType.I64, "NOT_I64");
        } else {
            revert("BAD_EQZ");
        }

        uint32 output;
        if (v.contents == 0) {
            output = 1;
        } else {
            output = 0;
        }

        mach.valueStack.push(ValueLib.newI32(output));
    }

    function signExtend(uint32 a) internal pure returns (uint64) {
        if (a & (1 << 31) != 0) {
            return uint64(a) | uint64(0xffffffff00000000);
        }
        return uint64(a);
    }

    function i64RelOp(
        uint64 a,
        uint64 b,
        uint16 relop
    ) internal pure returns (bool) {
        if (relop == Instructions.IRELOP_EQ) {
            return (a == b);
        } else if (relop == Instructions.IRELOP_NE) {
            return (a != b);
        } else if (relop == Instructions.IRELOP_LT_S) {
            return (int64(a) < int64(b));
        } else if (relop == Instructions.IRELOP_LT_U) {
            return (a < b);
        } else if (relop == Instructions.IRELOP_GT_S) {
            return (int64(a) > int64(b));
        } else if (relop == Instructions.IRELOP_GT_U) {
            return (a > b);
        } else if (relop == Instructions.IRELOP_LE_S) {
            return (int64(a) <= int64(b));
        } else if (relop == Instructions.IRELOP_LE_U) {
            return (a <= b);
        } else if (relop == Instructions.IRELOP_GE_S) {
            return (int64(a) >= int64(b));
        } else if (relop == Instructions.IRELOP_GE_U) {
            return (a >= b);
        } else {
            revert("BAD IRELOP");
        }
    }

    function executeI32RelOp(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        uint32 b = mach.valueStack.pop().assumeI32();
        uint32 a = mach.valueStack.pop().assumeI32();

        uint16 relop = inst.opcode - Instructions.I32_RELOP_BASE;
        uint64 a64;
        uint64 b64;

        if (
            relop == Instructions.IRELOP_LT_S ||
            relop == Instructions.IRELOP_GT_S ||
            relop == Instructions.IRELOP_LE_S ||
            relop == Instructions.IRELOP_GE_S
        ) {
            a64 = signExtend(a);
            b64 = signExtend(b);
        } else {
            a64 = uint64(a);
            b64 = uint64(b);
        }

        bool res = i64RelOp(a64, b64, relop);

        mach.valueStack.push(ValueLib.newBoolean(res));
    }

    function executeI64RelOp(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        uint64 b = mach.valueStack.pop().assumeI64();
        uint64 a = mach.valueStack.pop().assumeI64();

        uint16 relop = inst.opcode - Instructions.I64_RELOP_BASE;

        bool res = i64RelOp(a, b, relop);

        mach.valueStack.push(ValueLib.newBoolean(res));
    }

    function genericIUnOp(
        uint64 a,
        uint16 unop,
        uint16 bits
    ) internal pure returns (uint32) {
        require(bits == 32 || bits == 64, "WRONG USE OF genericUnOp");
        if (unop == Instructions.IUNOP_CLZ) {
            /* curbits is one-based to keep with unsigned mathematics */
            uint32 curbit = bits;
            while (curbit > 0 && (a & (1 << (curbit - 1)) == 0)) {
                curbit -= 1;
            }
            return (bits - curbit);
        } else if (unop == Instructions.IUNOP_CTZ) {
            uint32 curbit = 0;
            while (curbit < bits && ((a & (1 << curbit)) == 0)) {
                curbit += 1;
            }
            return curbit;
        } else if (unop == Instructions.IUNOP_POPCNT) {
            uint32 curbit = 0;
            uint32 res = 0;
            while (curbit < bits) {
                if ((a & (1 << curbit)) != 0) {
                    res += 1;
                }
                curbit++;
            }
            return res;
        }
        revert("BAD IUnOp");
    }

    function executeI32UnOp(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        uint32 a = mach.valueStack.pop().assumeI32();

        uint16 unop = inst.opcode - Instructions.I32_UNOP_BASE;

        uint32 res = genericIUnOp(a, unop, 32);

        mach.valueStack.push(ValueLib.newI32(res));
    }

    function executeI64UnOp(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        uint64 a = mach.valueStack.pop().assumeI64();

        uint16 unop = inst.opcode - Instructions.I64_UNOP_BASE;

        uint64 res = uint64(genericIUnOp(a, unop, 64));

        mach.valueStack.push(ValueLib.newI64(res));
    }

    function rotl32(uint32 a, uint32 b) internal pure returns (uint32) {
        b %= 32;
        return (a << b) | (a >> (32 - b));
    }

    function rotl64(uint64 a, uint64 b) internal pure returns (uint64) {
        b %= 64;
        return (a << b) | (a >> (64 - b));
    }

    function rotr32(uint32 a, uint32 b) internal pure returns (uint32) {
        b %= 32;
        return (a >> b) | (a << (32 - b));
    }

    function rotr64(uint64 a, uint64 b) internal pure returns (uint64) {
        b %= 64;
        return (a >> b) | (a << (64 - b));
    }

    function genericBinOp(
        uint64 a,
        uint64 b,
        uint16 opcodeOffset
    ) internal pure returns (uint64, bool) {
        unchecked {
            if (opcodeOffset == 0) {
                // add
                return (a + b, false);
            } else if (opcodeOffset == 1) {
                // sub
                return (a - b, false);
            } else if (opcodeOffset == 2) {
                // mul
                return (a * b, false);
            } else if (opcodeOffset == 4) {
                // div_u
                if (b == 0) {
                    return (0, true);
                }
                return (a / b, false);
            } else if (opcodeOffset == 6) {
                // rem_u
                if (b == 0) {
                    return (0, true);
                }
                return (a % b, false);
            } else if (opcodeOffset == 7) {
                // and
                return (a & b, false);
            } else if (opcodeOffset == 8) {
                // or
                return (a | b, false);
            } else if (opcodeOffset == 9) {
                // xor
                return (a ^ b, false);
            } else {
                revert("INVALID_GENERIC_BIN_OP");
            }
        }
    }

    function executeI32BinOp(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        uint32 b = mach.valueStack.pop().assumeI32();
        uint32 a = mach.valueStack.pop().assumeI32();
        uint32 res;

        uint16 opcodeOffset = inst.opcode - Instructions.I32_ADD;

        unchecked {
            if (opcodeOffset == 3) {
                // div_s
                if (b == 0 || (int32(a) == -2147483648 && int32(b) == -1)) {
                    mach.status = MachineStatus.ERRORED;
                    return;
                }
                res = uint32(int32(a) / int32(b));
            } else if (opcodeOffset == 5) {
                // rem_s
                if (b == 0) {
                    mach.status = MachineStatus.ERRORED;
                    return;
                }
                res = uint32(int32(a) % int32(b));
            } else if (opcodeOffset == 10) {
                // shl
                res = a << (b % 32);
            } else if (opcodeOffset == 12) {
                // shr_u
                res = a >> (b % 32);
            } else if (opcodeOffset == 11) {
                // shr_s
                res = uint32(int32(a) >> (b % 32));
            } else if (opcodeOffset == 13) {
                // rotl
                res = rotl32(a, b);
            } else if (opcodeOffset == 14) {
                // rotr
                res = rotr32(a, b);
            } else {
                (uint64 computed, bool err) = genericBinOp(a, b, opcodeOffset);
                if (err) {
                    mach.status = MachineStatus.ERRORED;
                    return;
                }
                res = uint32(computed);
            }
        }

        mach.valueStack.push(ValueLib.newI32(res));
    }

    function executeI64BinOp(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        uint64 b = mach.valueStack.pop().assumeI64();
        uint64 a = mach.valueStack.pop().assumeI64();
        uint64 res;

        uint16 opcodeOffset = inst.opcode - Instructions.I64_ADD;

        unchecked {
            if (opcodeOffset == 3) {
                // div_s
                if (b == 0 || (int64(a) == -9223372036854775808 && int64(b) == -1)) {
                    mach.status = MachineStatus.ERRORED;
                    return;
                }
                res = uint64(int64(a) / int64(b));
            } else if (opcodeOffset == 5) {
                // rem_s
                if (b == 0) {
                    mach.status = MachineStatus.ERRORED;
                    return;
                }
                res = uint64(int64(a) % int64(b));
            } else if (opcodeOffset == 10) {
                // shl
                res = a << (b % 64);
            } else if (opcodeOffset == 12) {
                // shr_u
                res = a >> (b % 64);
            } else if (opcodeOffset == 11) {
                // shr_s
                res = uint64(int64(a) >> (b % 64));
            } else if (opcodeOffset == 13) {
                // rotl
                res = rotl64(a, b);
            } else if (opcodeOffset == 14) {
                // rotr
                res = rotr64(a, b);
            } else {
                bool err;
                (res, err) = genericBinOp(a, b, opcodeOffset);
                if (err) {
                    mach.status = MachineStatus.ERRORED;
                    return;
                }
            }
        }

        mach.valueStack.push(ValueLib.newI64(res));
    }

    function executeI32WrapI64(
        Machine memory mach,
        Module memory,
        Instruction calldata,
        bytes calldata
    ) internal pure {
        uint64 a = mach.valueStack.pop().assumeI64();

        uint32 a32 = uint32(a);

        mach.valueStack.push(ValueLib.newI32(a32));
    }

    function executeI64ExtendI32(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        uint32 a = mach.valueStack.pop().assumeI32();

        uint64 a64;

        if (inst.opcode == Instructions.I64_EXTEND_I32_S) {
            a64 = signExtend(a);
        } else {
            a64 = uint64(a);
        }

        mach.valueStack.push(ValueLib.newI64(a64));
    }

    function executeExtendSameType(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        ValueType ty;
        uint8 sourceBits;
        if (inst.opcode == Instructions.I32_EXTEND_8S) {
            ty = ValueType.I32;
            sourceBits = 8;
        } else if (inst.opcode == Instructions.I32_EXTEND_16S) {
            ty = ValueType.I32;
            sourceBits = 16;
        } else if (inst.opcode == Instructions.I64_EXTEND_8S) {
            ty = ValueType.I64;
            sourceBits = 8;
        } else if (inst.opcode == Instructions.I64_EXTEND_16S) {
            ty = ValueType.I64;
            sourceBits = 16;
        } else if (inst.opcode == Instructions.I64_EXTEND_32S) {
            ty = ValueType.I64;
            sourceBits = 32;
        } else {
            revert("INVALID_EXTEND_SAME_TYPE");
        }
        uint256 resultMask;
        if (ty == ValueType.I32) {
            resultMask = (1 << 32) - 1;
        } else {
            resultMask = (1 << 64) - 1;
        }
        Value memory val = mach.valueStack.pop();
        require(val.valueType == ty, "BAD_EXTEND_SAME_TYPE_TYPE");
        uint256 sourceMask = (1 << sourceBits) - 1;
        val.contents &= sourceMask;
        if (val.contents & (1 << (sourceBits - 1)) != 0) {
            // Extend sign flag
            val.contents |= resultMask & ~sourceMask;
        }
        mach.valueStack.push(val);
    }

    function executeReinterpret(
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        ValueType destTy;
        ValueType sourceTy;
        if (inst.opcode == Instructions.I32_REINTERPRET_F32) {
            destTy = ValueType.I32;
            sourceTy = ValueType.F32;
        } else if (inst.opcode == Instructions.I64_REINTERPRET_F64) {
            destTy = ValueType.I64;
            sourceTy = ValueType.F64;
        } else if (inst.opcode == Instructions.F32_REINTERPRET_I32) {
            destTy = ValueType.F32;
            sourceTy = ValueType.I32;
        } else if (inst.opcode == Instructions.F64_REINTERPRET_I64) {
            destTy = ValueType.F64;
            sourceTy = ValueType.I64;
        } else {
            revert("INVALID_REINTERPRET");
        }
        Value memory val = mach.valueStack.pop();
        require(val.valueType == sourceTy, "INVALID_REINTERPRET_TYPE");
        val.valueType = destTy;
        mach.valueStack.push(val);
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
        if (opcode == Instructions.I32_EQZ || opcode == Instructions.I64_EQZ) {
            impl = executeEqz;
        } else if (
            opcode >= Instructions.I32_RELOP_BASE &&
            opcode <= Instructions.I32_RELOP_BASE + Instructions.IRELOP_LAST
        ) {
            impl = executeI32RelOp;
        } else if (
            opcode >= Instructions.I32_UNOP_BASE &&
            opcode <= Instructions.I32_UNOP_BASE + Instructions.IUNOP_LAST
        ) {
            impl = executeI32UnOp;
        } else if (opcode >= Instructions.I32_ADD && opcode <= Instructions.I32_ROTR) {
            impl = executeI32BinOp;
        } else if (
            opcode >= Instructions.I64_RELOP_BASE &&
            opcode <= Instructions.I64_RELOP_BASE + Instructions.IRELOP_LAST
        ) {
            impl = executeI64RelOp;
        } else if (
            opcode >= Instructions.I64_UNOP_BASE &&
            opcode <= Instructions.I64_UNOP_BASE + Instructions.IUNOP_LAST
        ) {
            impl = executeI64UnOp;
        } else if (opcode >= Instructions.I64_ADD && opcode <= Instructions.I64_ROTR) {
            impl = executeI64BinOp;
        } else if (opcode == Instructions.I32_WRAP_I64) {
            impl = executeI32WrapI64;
        } else if (
            opcode == Instructions.I64_EXTEND_I32_S || opcode == Instructions.I64_EXTEND_I32_U
        ) {
            impl = executeI64ExtendI32;
        } else if (opcode >= Instructions.I32_EXTEND_8S && opcode <= Instructions.I64_EXTEND_32S) {
            impl = executeExtendSameType;
        } else if (
            opcode >= Instructions.I32_REINTERPRET_F32 && opcode <= Instructions.F64_REINTERPRET_I64
        ) {
            impl = executeReinterpret;
        } else {
            revert("INVALID_OPCODE");
        }

        impl(mach, mod, inst, proof);
    }
}