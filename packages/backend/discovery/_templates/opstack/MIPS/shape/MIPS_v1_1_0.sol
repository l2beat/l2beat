// SPDX-License-Identifier: Unknown
pragma solidity 0.8.15;

library MIPSInstructions {
    /// @param _pc The program counter.
    /// @param _memRoot The current memory root.
    /// @param _insnProofOffset The calldata offset of the memory proof for the current instruction.
    /// @return insn_ The current 32-bit instruction at the pc.
    /// @return opcode_ The opcode value parsed from insn_.
    /// @return fun_ The function value parsed from insn_.
    function getInstructionDetails(
        uint32 _pc,
        bytes32 _memRoot,
        uint256 _insnProofOffset
    )
        internal
        pure
        returns (uint32 insn_, uint32 opcode_, uint32 fun_)
    {
        unchecked {
            insn_ = MIPSMemory.readMem(_memRoot, _pc, _insnProofOffset);
            opcode_ = insn_ >> 26; // First 6-bits
            fun_ = insn_ & 0x3f; // Last 6-bits

            return (insn_, opcode_, fun_);
        }
    }

    /// @notice Execute core MIPS step logic.
    /// @notice _cpu The CPU scalar fields.
    /// @notice _registers The CPU registers.
    /// @notice _memRoot The current merkle root of the memory.
    /// @notice _memProofOffset The offset in calldata specify where the memory merkle proof is located.
    /// @param _insn The current 32-bit instruction at the pc.
    /// @param _opcode The opcode value parsed from insn_.
    /// @param _fun The function value parsed from insn_.
    /// @return newMemRoot_ The updated merkle root of memory after any modifications, may be unchanged.
    function execMipsCoreStepLogic(
        st.CpuScalars memory _cpu,
        uint32[32] memory _registers,
        bytes32 _memRoot,
        uint256 _memProofOffset,
        uint32 _insn,
        uint32 _opcode,
        uint32 _fun
    )
        internal
        pure
        returns (bytes32 newMemRoot_)
    {
        unchecked {
            newMemRoot_ = _memRoot;

            // j-type j/jal
            if (_opcode == 2 || _opcode == 3) {
                // Take top 4 bits of the next PC (its 256 MB region), and concatenate with the 26-bit offset
                uint32 target = (_cpu.nextPC & 0xF0000000) | (_insn & 0x03FFFFFF) << 2;
                handleJump(_cpu, _registers, _opcode == 2 ? 0 : 31, target);
                return newMemRoot_;
            }

            // register fetch
            uint32 rs = 0; // source register 1 value
            uint32 rt = 0; // source register 2 / temp value
            uint32 rtReg = (_insn >> 16) & 0x1F;

            // R-type or I-type (stores rt)
            rs = _registers[(_insn >> 21) & 0x1F];
            uint32 rdReg = rtReg;

            if (_opcode == 0 || _opcode == 0x1c) {
                // R-type (stores rd)
                rt = _registers[rtReg];
                rdReg = (_insn >> 11) & 0x1F;
            } else if (_opcode < 0x20) {
                // rt is SignExtImm
                // don't sign extend for andi, ori, xori
                if (_opcode == 0xC || _opcode == 0xD || _opcode == 0xe) {
                    // ZeroExtImm
                    rt = _insn & 0xFFFF;
                } else {
                    // SignExtImm
                    rt = signExtend(_insn & 0xFFFF, 16);
                }
            } else if (_opcode >= 0x28 || _opcode == 0x22 || _opcode == 0x26) {
                // store rt value with store
                rt = _registers[rtReg];

                // store actual rt with lwl and lwr
                rdReg = rtReg;
            }

            if ((_opcode >= 4 && _opcode < 8) || _opcode == 1) {
                handleBranch({
                    _cpu: _cpu,
                    _registers: _registers,
                    _opcode: _opcode,
                    _insn: _insn,
                    _rtReg: rtReg,
                    _rs: rs
                });
                return newMemRoot_;
            }

            uint32 storeAddr = 0xFF_FF_FF_FF;
            // memory fetch (all I-type)
            // we do the load for stores also
            uint32 mem = 0;
            if (_opcode >= 0x20) {
                // M[R[rs]+SignExtImm]
                rs += signExtend(_insn & 0xFFFF, 16);
                uint32 addr = rs & 0xFFFFFFFC;
                mem = MIPSMemory.readMem(_memRoot, addr, _memProofOffset);
                if (_opcode >= 0x28 && _opcode != 0x30) {
                    // store
                    storeAddr = addr;
                    // store opcodes don't write back to a register
                    rdReg = 0;
                }
            }

            // ALU
            // Note: swr outputs more than 4 bytes without the mask 0xffFFffFF
            uint32 val = executeMipsInstruction(_insn, _opcode, _fun, rs, rt, mem) & 0xffFFffFF;

            if (_opcode == 0 && _fun >= 8 && _fun < 0x1c) {
                if (_fun == 8 || _fun == 9) {
                    // jr/jalr
                    handleJump(_cpu, _registers, _fun == 8 ? 0 : rdReg, rs);
                    return newMemRoot_;
                }

                if (_fun == 0xa) {
                    // movz
                    handleRd(_cpu, _registers, rdReg, rs, rt == 0);
                    return newMemRoot_;
                }
                if (_fun == 0xb) {
                    // movn
                    handleRd(_cpu, _registers, rdReg, rs, rt != 0);
                    return newMemRoot_;
                }

                // lo and hi registers
                // can write back
                if (_fun >= 0x10 && _fun < 0x1c) {
                    handleHiLo({ _cpu: _cpu, _registers: _registers, _fun: _fun, _rs: rs, _rt: rt, _storeReg: rdReg });

                    return newMemRoot_;
                }
            }

            // stupid sc, write a 1 to rt
            if (_opcode == 0x38 && rtReg != 0) {
                _registers[rtReg] = 1;
            }

            // write memory
            if (storeAddr != 0xFF_FF_FF_FF) {
                newMemRoot_ = MIPSMemory.writeMem(storeAddr, _memProofOffset, val);
            }

            // write back the value to destination register
            handleRd(_cpu, _registers, rdReg, val, true);

            return newMemRoot_;
        }
    }

    /// @notice Execute an instruction.
    function executeMipsInstruction(
        uint32 _insn,
        uint32 _opcode,
        uint32 _fun,
        uint32 _rs,
        uint32 _rt,
        uint32 _mem
    )
        internal
        pure
        returns (uint32 out_)
    {
        unchecked {
            if (_opcode == 0 || (_opcode >= 8 && _opcode < 0xF)) {
                assembly {
                    // transform ArithLogI to SPECIAL
                    switch _opcode
                    // addi
                    case 0x8 { _fun := 0x20 }
                    // addiu
                    case 0x9 { _fun := 0x21 }
                    // stli
                    case 0xA { _fun := 0x2A }
                    // sltiu
                    case 0xB { _fun := 0x2B }
                    // andi
                    case 0xC { _fun := 0x24 }
                    // ori
                    case 0xD { _fun := 0x25 }
                    // xori
                    case 0xE { _fun := 0x26 }
                }

                // sll
                if (_fun == 0x00) {
                    return _rt << ((_insn >> 6) & 0x1F);
                }
                // srl
                else if (_fun == 0x02) {
                    return _rt >> ((_insn >> 6) & 0x1F);
                }
                // sra
                else if (_fun == 0x03) {
                    uint32 shamt = (_insn >> 6) & 0x1F;
                    return signExtend(_rt >> shamt, 32 - shamt);
                }
                // sllv
                else if (_fun == 0x04) {
                    return _rt << (_rs & 0x1F);
                }
                // srlv
                else if (_fun == 0x6) {
                    return _rt >> (_rs & 0x1F);
                }
                // srav
                else if (_fun == 0x07) {
                    // shamt here is different than the typical shamt which comes from the
                    // instruction itself, here it comes from the rs register
                    uint32 shamt = _rs & 0x1F;
                    return signExtend(_rt >> shamt, 32 - shamt);
                }
                // functs in range [0x8, 0x1b] are handled specially by other functions
                // Explicitly enumerate each funct in range to reduce code diff against Go Vm
                // jr
                else if (_fun == 0x08) {
                    return _rs;
                }
                // jalr
                else if (_fun == 0x09) {
                    return _rs;
                }
                // movz
                else if (_fun == 0x0a) {
                    return _rs;
                }
                // movn
                else if (_fun == 0x0b) {
                    return _rs;
                }
                // syscall
                else if (_fun == 0x0c) {
                    return _rs;
                }
                // 0x0d - break not supported
                // sync
                else if (_fun == 0x0f) {
                    return _rs;
                }
                // mfhi
                else if (_fun == 0x10) {
                    return _rs;
                }
                // mthi
                else if (_fun == 0x11) {
                    return _rs;
                }
                // mflo
                else if (_fun == 0x12) {
                    return _rs;
                }
                // mtlo
                else if (_fun == 0x13) {
                    return _rs;
                }
                // mult
                else if (_fun == 0x18) {
                    return _rs;
                }
                // multu
                else if (_fun == 0x19) {
                    return _rs;
                }
                // div
                else if (_fun == 0x1a) {
                    return _rs;
                }
                // divu
                else if (_fun == 0x1b) {
                    return _rs;
                }
                // The rest includes transformed R-type arith imm instructions
                // add
                else if (_fun == 0x20) {
                    return (_rs + _rt);
                }
                // addu
                else if (_fun == 0x21) {
                    return (_rs + _rt);
                }
                // sub
                else if (_fun == 0x22) {
                    return (_rs - _rt);
                }
                // subu
                else if (_fun == 0x23) {
                    return (_rs - _rt);
                }
                // and
                else if (_fun == 0x24) {
                    return (_rs & _rt);
                }
                // or
                else if (_fun == 0x25) {
                    return (_rs | _rt);
                }
                // xor
                else if (_fun == 0x26) {
                    return (_rs ^ _rt);
                }
                // nor
                else if (_fun == 0x27) {
                    return ~(_rs | _rt);
                }
                // slti
                else if (_fun == 0x2a) {
                    return int32(_rs) < int32(_rt) ? 1 : 0;
                }
                // sltiu
                else if (_fun == 0x2b) {
                    return _rs < _rt ? 1 : 0;
                } else {
                    revert("invalid instruction");
                }
            } else {
                // SPECIAL2
                if (_opcode == 0x1C) {
                    // mul
                    if (_fun == 0x2) {
                        return uint32(int32(_rs) * int32(_rt));
                    }
                    // clz, clo
                    else if (_fun == 0x20 || _fun == 0x21) {
                        if (_fun == 0x20) {
                            _rs = ~_rs;
                        }
                        uint32 i = 0;
                        while (_rs & 0x80000000 != 0) {
                            i++;
                            _rs <<= 1;
                        }
                        return i;
                    }
                }
                // lui
                else if (_opcode == 0x0F) {
                    return _rt << 16;
                }
                // lb
                else if (_opcode == 0x20) {
                    return signExtend((_mem >> (24 - (_rs & 3) * 8)) & 0xFF, 8);
                }
                // lh
                else if (_opcode == 0x21) {
                    return signExtend((_mem >> (16 - (_rs & 2) * 8)) & 0xFFFF, 16);
                }
                // lwl
                else if (_opcode == 0x22) {
                    uint32 val = _mem << ((_rs & 3) * 8);
                    uint32 mask = uint32(0xFFFFFFFF) << ((_rs & 3) * 8);
                    return (_rt & ~mask) | val;
                }
                // lw
                else if (_opcode == 0x23) {
                    return _mem;
                }
                // lbu
                else if (_opcode == 0x24) {
                    return (_mem >> (24 - (_rs & 3) * 8)) & 0xFF;
                }
                //  lhu
                else if (_opcode == 0x25) {
                    return (_mem >> (16 - (_rs & 2) * 8)) & 0xFFFF;
                }
                //  lwr
                else if (_opcode == 0x26) {
                    uint32 val = _mem >> (24 - (_rs & 3) * 8);
                    uint32 mask = uint32(0xFFFFFFFF) >> (24 - (_rs & 3) * 8);
                    return (_rt & ~mask) | val;
                }
                //  sb
                else if (_opcode == 0x28) {
                    uint32 val = (_rt & 0xFF) << (24 - (_rs & 3) * 8);
                    uint32 mask = 0xFFFFFFFF ^ uint32(0xFF << (24 - (_rs & 3) * 8));
                    return (_mem & mask) | val;
                }
                //  sh
                else if (_opcode == 0x29) {
                    uint32 val = (_rt & 0xFFFF) << (16 - (_rs & 2) * 8);
                    uint32 mask = 0xFFFFFFFF ^ uint32(0xFFFF << (16 - (_rs & 2) * 8));
                    return (_mem & mask) | val;
                }
                //  swl
                else if (_opcode == 0x2a) {
                    uint32 val = _rt >> ((_rs & 3) * 8);
                    uint32 mask = uint32(0xFFFFFFFF) >> ((_rs & 3) * 8);
                    return (_mem & ~mask) | val;
                }
                //  sw
                else if (_opcode == 0x2b) {
                    return _rt;
                }
                //  swr
                else if (_opcode == 0x2e) {
                    uint32 val = _rt << (24 - (_rs & 3) * 8);
                    uint32 mask = uint32(0xFFFFFFFF) << (24 - (_rs & 3) * 8);
                    return (_mem & ~mask) | val;
                }
                // ll
                else if (_opcode == 0x30) {
                    return _mem;
                }
                // sc
                else if (_opcode == 0x38) {
                    return _rt;
                } else {
                    revert("invalid instruction");
                }
            }
            revert("invalid instruction");
        }
    }

    /// @notice Extends the value leftwards with its most significant bit (sign extension).
    function signExtend(uint32 _dat, uint32 _idx) internal pure returns (uint32 out_) {
        unchecked {
            bool isSigned = (_dat >> (_idx - 1)) != 0;
            uint256 signed = ((1 << (32 - _idx)) - 1) << _idx;
            uint256 mask = (1 << _idx) - 1;
            return uint32(_dat & mask | (isSigned ? signed : 0));
        }
    }

    /// @notice Handles a branch instruction, updating the MIPS state PC where needed.
    /// @param _cpu Holds the state of cpu scalars pc, nextPC, hi, lo.
    /// @param _registers Holds the current state of the cpu registers.
    /// @param _opcode The opcode of the branch instruction.
    /// @param _insn The instruction to be executed.
    /// @param _rtReg The register to be used for the branch.
    /// @param _rs The register to be compared with the branch register.
    function handleBranch(
        st.CpuScalars memory _cpu,
        uint32[32] memory _registers,
        uint32 _opcode,
        uint32 _insn,
        uint32 _rtReg,
        uint32 _rs
    )
        internal
        pure
    {
        unchecked {
            bool shouldBranch = false;

            if (_cpu.nextPC != _cpu.pc + 4) {
                revert("branch in delay slot");
            }

            // beq/bne: Branch on equal / not equal
            if (_opcode == 4 || _opcode == 5) {
                uint32 rt = _registers[_rtReg];
                shouldBranch = (_rs == rt && _opcode == 4) || (_rs != rt && _opcode == 5);
            }
            // blez: Branches if instruction is less than or equal to zero
            else if (_opcode == 6) {
                shouldBranch = int32(_rs) <= 0;
            }
            // bgtz: Branches if instruction is greater than zero
            else if (_opcode == 7) {
                shouldBranch = int32(_rs) > 0;
            }
            // bltz/bgez: Branch on less than zero / greater than or equal to zero
            else if (_opcode == 1) {
                // regimm
                uint32 rtv = ((_insn >> 16) & 0x1F);
                if (rtv == 0) {
                    shouldBranch = int32(_rs) < 0;
                }
                if (rtv == 1) {
                    shouldBranch = int32(_rs) >= 0;
                }
            }

            // Update the state's previous PC
            uint32 prevPC = _cpu.pc;

            // Execute the delay slot first
            _cpu.pc = _cpu.nextPC;

            // If we should branch, update the PC to the branch target
            // Otherwise, proceed to the next instruction
            if (shouldBranch) {
                _cpu.nextPC = prevPC + 4 + (signExtend(_insn & 0xFFFF, 16) << 2);
            } else {
                _cpu.nextPC = _cpu.nextPC + 4;
            }
        }
    }

    /// @notice Handles HI and LO register instructions.
    /// @param _cpu Holds the state of cpu scalars pc, nextPC, hi, lo.
    /// @param _registers Holds the current state of the cpu registers.
    /// @param _fun The function code of the instruction.
    /// @param _rs The value of the RS register.
    /// @param _rt The value of the RT register.
    /// @param _storeReg The register to store the result in.
    function handleHiLo(
        st.CpuScalars memory _cpu,
        uint32[32] memory _registers,
        uint32 _fun,
        uint32 _rs,
        uint32 _rt,
        uint32 _storeReg
    )
        internal
        pure
    {
        unchecked {
            uint32 val = 0;

            // mfhi: Move the contents of the HI register into the destination
            if (_fun == 0x10) {
                val = _cpu.hi;
            }
            // mthi: Move the contents of the source into the HI register
            else if (_fun == 0x11) {
                _cpu.hi = _rs;
            }
            // mflo: Move the contents of the LO register into the destination
            else if (_fun == 0x12) {
                val = _cpu.lo;
            }
            // mtlo: Move the contents of the source into the LO register
            else if (_fun == 0x13) {
                _cpu.lo = _rs;
            }
            // mult: Multiplies `rs` by `rt` and stores the result in HI and LO registers
            else if (_fun == 0x18) {
                uint64 acc = uint64(int64(int32(_rs)) * int64(int32(_rt)));
                _cpu.hi = uint32(acc >> 32);
                _cpu.lo = uint32(acc);
            }
            // multu: Unsigned multiplies `rs` by `rt` and stores the result in HI and LO registers
            else if (_fun == 0x19) {
                uint64 acc = uint64(uint64(_rs) * uint64(_rt));
                _cpu.hi = uint32(acc >> 32);
                _cpu.lo = uint32(acc);
            }
            // div: Divides `rs` by `rt`.
            // Stores the quotient in LO
            // And the remainder in HI
            else if (_fun == 0x1a) {
                if (int32(_rt) == 0) {
                    revert("MIPS: division by zero");
                }
                _cpu.hi = uint32(int32(_rs) % int32(_rt));
                _cpu.lo = uint32(int32(_rs) / int32(_rt));
            }
            // divu: Unsigned divides `rs` by `rt`.
            // Stores the quotient in LO
            // And the remainder in HI
            else if (_fun == 0x1b) {
                if (_rt == 0) {
                    revert("MIPS: division by zero");
                }
                _cpu.hi = _rs % _rt;
                _cpu.lo = _rs / _rt;
            }

            // Store the result in the destination register, if applicable
            if (_storeReg != 0) {
                _registers[_storeReg] = val;
            }

            // Update the PC
            _cpu.pc = _cpu.nextPC;
            _cpu.nextPC = _cpu.nextPC + 4;
        }
    }

    /// @notice Handles a jump instruction, updating the MIPS state PC where needed.
    /// @param _cpu Holds the state of cpu scalars pc, nextPC, hi, lo.
    /// @param _registers Holds the current state of the cpu registers.
    /// @param _linkReg The register to store the link to the instruction after the delay slot instruction.
    /// @param _dest The destination to jump to.
    function handleJump(
        st.CpuScalars memory _cpu,
        uint32[32] memory _registers,
        uint32 _linkReg,
        uint32 _dest
    )
        internal
        pure
    {
        unchecked {
            if (_cpu.nextPC != _cpu.pc + 4) {
                revert("jump in delay slot");
            }

            // Update the next PC to the jump destination.
            uint32 prevPC = _cpu.pc;
            _cpu.pc = _cpu.nextPC;
            _cpu.nextPC = _dest;

            // Update the link-register to the instruction after the delay slot instruction.
            if (_linkReg != 0) {
                _registers[_linkReg] = prevPC + 8;
            }
        }
    }

    /// @notice Handles a storing a value into a register.
    /// @param _cpu Holds the state of cpu scalars pc, nextPC, hi, lo.
    /// @param _registers Holds the current state of the cpu registers.
    /// @param _storeReg The register to store the value into.
    /// @param _val The value to store.
    /// @param _conditional Whether or not the store is conditional.
    function handleRd(
        st.CpuScalars memory _cpu,
        uint32[32] memory _registers,
        uint32 _storeReg,
        uint32 _val,
        bool _conditional
    )
        internal
        pure
    {
        unchecked {
            // The destination register must be valid.
            require(_storeReg < 32, "valid register");

            // Never write to reg 0, and it can be conditional (movz, movn).
            if (_storeReg != 0 && _conditional) {
                _registers[_storeReg] = _val;
            }

            // Update the PC.
            _cpu.pc = _cpu.nextPC;
            _cpu.nextPC = _cpu.nextPC + 4;
        }
    }
}

library MIPSMemory {
    /// @notice Reads a 32-bit value from memory.
    /// @param _memRoot The current memory root
    /// @param _addr The address to read from.
    /// @param _proofOffset The offset of the memory proof in calldata.
    /// @return out_ The hashed MIPS state.
    function readMem(bytes32 _memRoot, uint32 _addr, uint256 _proofOffset) internal pure returns (uint32 out_) {
        unchecked {
            validateMemoryProofAvailability(_proofOffset);
            assembly {
                // Validate the address alignement.
                if and(_addr, 3) { revert(0, 0) }

                // Load the leaf value.
                let leaf := calldataload(_proofOffset)
                _proofOffset := add(_proofOffset, 32)

                // Convenience function to hash two nodes together in scratch space.
                function hashPair(a, b) -> h {
                    mstore(0, a)
                    mstore(32, b)
                    h := keccak256(0, 64)
                }

                // Start with the leaf node.
                // Work back up by combining with siblings, to reconstruct the root.
                let path := shr(5, _addr)
                let node := leaf
                for { let i := 0 } lt(i, 27) { i := add(i, 1) } {
                    let sibling := calldataload(_proofOffset)
                    _proofOffset := add(_proofOffset, 32)
                    switch and(shr(i, path), 1)
                    case 0 { node := hashPair(node, sibling) }
                    case 1 { node := hashPair(sibling, node) }
                }

                // Verify the root matches.
                if iszero(eq(node, _memRoot)) {
                    mstore(0, 0x0badf00d)
                    revert(0, 32)
                }

                // Bits to shift = (32 - 4 - (addr % 32)) * 8
                let shamt := shl(3, sub(sub(32, 4), and(_addr, 31)))
                out_ := and(shr(shamt, leaf), 0xFFffFFff)
            }
        }
    }

    /// @notice Writes a 32-bit value to memory.
    ///         This function first overwrites the part of the leaf.
    ///         Then it recomputes the memory merkle root.
    /// @param _addr The address to write to.
    /// @param _proofOffset The offset of the memory proof in calldata.
    /// @param _val The value to write.
    /// @return newMemRoot_ The new memory root after modification
    function writeMem(uint32 _addr, uint256 _proofOffset, uint32 _val) internal pure returns (bytes32 newMemRoot_) {
        unchecked {
            validateMemoryProofAvailability(_proofOffset);
            assembly {
                // Validate the address alignement.
                if and(_addr, 3) { revert(0, 0) }

                // Load the leaf value.
                let leaf := calldataload(_proofOffset)
                let shamt := shl(3, sub(sub(32, 4), and(_addr, 31)))

                // Mask out 4 bytes, and OR in the value
                leaf := or(and(leaf, not(shl(shamt, 0xFFffFFff))), shl(shamt, _val))
                _proofOffset := add(_proofOffset, 32)

                // Convenience function to hash two nodes together in scratch space.
                function hashPair(a, b) -> h {
                    mstore(0, a)
                    mstore(32, b)
                    h := keccak256(0, 64)
                }

                // Start with the leaf node.
                // Work back up by combining with siblings, to reconstruct the root.
                let path := shr(5, _addr)
                let node := leaf
                for { let i := 0 } lt(i, 27) { i := add(i, 1) } {
                    let sibling := calldataload(_proofOffset)
                    _proofOffset := add(_proofOffset, 32)
                    switch and(shr(i, path), 1)
                    case 0 { node := hashPair(node, sibling) }
                    case 1 { node := hashPair(sibling, node) }
                }

                newMemRoot_ := node
            }
            return newMemRoot_;
        }
    }

    /// @notice Computes the offset of a memory proof in the calldata.
    /// @param _proofDataOffset The offset of the set of all memory proof data within calldata (proof.offset)
    ///     Equal to the offset of the first memory proof (at _proofIndex 0).
    /// @param _proofIndex The index of the proof in the calldata.
    /// @return offset_ The offset of the memory proof at the given _proofIndex in the calldata.
    function memoryProofOffset(uint256 _proofDataOffset, uint8 _proofIndex) internal pure returns (uint256 offset_) {
        unchecked {
            // A proof of 32 bit memory, with 32-byte leaf values, is (32-5)=27 bytes32 entries.
            // And the leaf value itself needs to be encoded as well: (27 + 1) = 28 bytes32 entries.
            offset_ = _proofDataOffset + (uint256(_proofIndex) * (28 * 32));
            return offset_;
        }
    }

    /// @notice Validates that enough calldata is available to hold a full memory proof at the given offset
    /// @param _proofStartOffset The index of the first byte of the target memory proof in calldata
    function validateMemoryProofAvailability(uint256 _proofStartOffset) internal pure {
        unchecked {
            uint256 s = 0;
            assembly {
                s := calldatasize()
            }
            // A memory proof consists of 28 bytes32 values - verify we have enough calldata
            require(s >= (_proofStartOffset + 28 * 32), "check that there is enough calldata");
        }
    }
}

library PreimageKeyLib {
    /// @notice Generates a context-specific local key for the given local data identifier.
    /// @dev See `localize` for a description of the localization operation.
    /// @param _ident The identifier of the local data. [0, 32) bytes in size.
    /// @param _localContext The local context for the key.
    /// @return key_ The context-specific local key.
    function localizeIdent(uint256 _ident, bytes32 _localContext) internal view returns (bytes32 key_) {
        assembly {
            // Set the type byte in the given identifier to `1` (Local). We only care about
            // the [1, 32) bytes in this value.
            key_ := or(shl(248, 1), and(_ident, not(shl(248, 0xFF))))
        }
        // Localize the key with the given local context.
        key_ = localize(key_, _localContext);
    }

    /// @notice Localizes a given local data key for the caller's context.
    /// @dev The localization operation is defined as:
    ///      localize(k) = H(k .. sender .. local_context) & ~(0xFF << 248) | (0x01 << 248)
    ///      where H is the Keccak-256 hash function.
    /// @param _key The local data key to localize.
    /// @param _localContext The local context for the key.
    /// @return localizedKey_ The localized local data key.
    function localize(bytes32 _key, bytes32 _localContext) internal view returns (bytes32 localizedKey_) {
        assembly {
            // Grab the current free memory pointer to restore later.
            let ptr := mload(0x40)
            // Store the local data key and caller next to each other in memory for hashing.
            mstore(0, _key)
            mstore(0x20, caller())
            mstore(0x40, _localContext)
            // Localize the key with the above `localize` operation.
            localizedKey_ := or(and(keccak256(0, 0x60), not(shl(248, 0xFF))), shl(248, 1))
            // Restore the free memory pointer.
            mstore(0x40, ptr)
        }
    }

    /// @notice Computes and returns the key for a global keccak pre-image.
    /// @param _preimage The pre-image.
    /// @return key_ The pre-image key.
    function keccak256PreimageKey(bytes memory _preimage) internal pure returns (bytes32 key_) {
        assembly {
            // Grab the size of the `_preimage`
            let size := mload(_preimage)

            // Compute the pre-image keccak256 hash (aka the pre-image key)
            let h := keccak256(add(_preimage, 0x20), size)

            // Mask out prefix byte, replace with type 2 byte
            key_ := or(and(h, not(shl(248, 0xFF))), shl(248, 2))
        }
    }
}

library MIPSState {
    struct CpuScalars {
        uint32 pc;
        uint32 nextPC;
        uint32 lo;
        uint32 hi;
    }
}

library MIPSSyscalls {
    struct SysReadParams {
        /// @param _a0 The file descriptor.
        uint32 a0;
        /// @param _a1 The memory location where data should be read to.
        uint32 a1;
        /// @param _a2 The number of bytes to read from the file
        uint32 a2;
        /// @param _preimageKey The key of the preimage to read.
        bytes32 preimageKey;
        /// @param _preimageOffset The offset of the preimage to read.
        uint32 preimageOffset;
        /// @param _localContext The local context for the preimage key.
        bytes32 localContext;
        /// @param _oracle The address of the preimage oracle.
        IPreimageOracle oracle;
        /// @param _proofOffset The offset of the memory proof in calldata.
        uint256 proofOffset;
        /// @param _memRoot The current memory root.
        bytes32 memRoot;
    }

    uint32 internal constant SYS_MMAP = 4090;
    uint32 internal constant SYS_BRK = 4045;
    uint32 internal constant SYS_CLONE = 4120;
    uint32 internal constant SYS_EXIT_GROUP = 4246;
    uint32 internal constant SYS_READ = 4003;
    uint32 internal constant SYS_WRITE = 4004;
    uint32 internal constant SYS_FCNTL = 4055;
    uint32 internal constant SYS_EXIT = 4001;
    uint32 internal constant SYS_SCHED_YIELD = 4162;
    uint32 internal constant SYS_GETTID = 4222;
    uint32 internal constant SYS_FUTEX = 4238;
    uint32 internal constant SYS_OPEN = 4005;
    uint32 internal constant SYS_NANOSLEEP = 4166;
    // unused syscalls
    uint32 internal constant SYS_CLOCK_GETTIME = 4263;
    uint32 internal constant SYS_GET_AFFINITY = 4240;
    uint32 internal constant SYS_GETAFFINITY = 4240;
    uint32 internal constant SYS_MADVISE = 4218;
    uint32 internal constant SYS_RTSIGPROCMASK = 4195;
    uint32 internal constant SYS_SIGALTSTACK = 4206;
    uint32 internal constant SYS_RTSIGACTION = 4194;
    uint32 internal constant SYS_PRLIMIT64 = 4338;
    uint32 internal constant SYS_CLOSE = 4006;
    uint32 internal constant SYS_PREAD64 = 4200;
    uint32 internal constant SYS_FSTAT64 = 4215;
    uint32 internal constant SYS_OPENAT = 4288;
    uint32 internal constant SYS_READLINK = 4085;
    uint32 internal constant SYS_READLINKAT = 4298;
    uint32 internal constant SYS_IOCTL = 4054;
    uint32 internal constant SYS_EPOLLCREATE1 = 4326;
    uint32 internal constant SYS_PIPE2 = 4328;
    uint32 internal constant SYS_EPOLLCTL = 4249;
    uint32 internal constant SYS_EPOLLPWAIT = 4313;
    uint32 internal constant SYS_GETRANDOM = 4353;
    uint32 internal constant SYS_UNAME = 4122;
    uint32 internal constant SYS_STAT64 = 4213;
    uint32 internal constant SYS_GETUID = 4024;
    uint32 internal constant SYS_GETGID = 4047;
    uint32 internal constant SYS_LLSEEK = 4140;
    uint32 internal constant SYS_MINCORE = 4217;
    uint32 internal constant SYS_TGKILL = 4266;
    // profiling-related syscalls - ignored
    uint32 internal constant SYS_SETITIMER = 4104;
    uint32 internal constant SYS_TIMERCREATE = 4257;
    uint32 internal constant SYS_TIMERSETTIME = 4258;
    uint32 internal constant SYS_TIMERDELETE = 4261;
    uint32 internal constant SYS_CLOCKGETTIME = 4263;
    uint32 internal constant SYS_MUNMAP = 4091;

    uint32 internal constant FD_STDIN = 0;
    uint32 internal constant FD_STDOUT = 1;
    uint32 internal constant FD_STDERR = 2;
    uint32 internal constant FD_HINT_READ = 3;
    uint32 internal constant FD_HINT_WRITE = 4;
    uint32 internal constant FD_PREIMAGE_READ = 5;
    uint32 internal constant FD_PREIMAGE_WRITE = 6;

    uint32 internal constant SYS_ERROR_SIGNAL = 0xFF_FF_FF_FF;
    uint32 internal constant EBADF = 0x9;
    uint32 internal constant EINVAL = 0x16;
    uint32 internal constant EAGAIN = 0xb;
    uint32 internal constant ETIMEDOUT = 0x91;

    uint32 internal constant FUTEX_WAIT_PRIVATE = 128;
    uint32 internal constant FUTEX_WAKE_PRIVATE = 129;
    uint32 internal constant FUTEX_TIMEOUT_STEPS = 10000;
    uint64 internal constant FUTEX_NO_TIMEOUT = type(uint64).max;
    uint32 internal constant FUTEX_EMPTY_ADDR = 0xFF_FF_FF_FF;

    uint32 internal constant SCHED_QUANTUM = 100_000;
    /// @notice Start of the data segment.
    uint32 internal constant PROGRAM_BREAK = 0x40000000;
    uint32 internal constant HEAP_END = 0x60000000;

    // SYS_CLONE flags
    uint32 internal constant CLONE_VM = 0x100;
    uint32 internal constant CLONE_FS = 0x200;
    uint32 internal constant CLONE_FILES = 0x400;
    uint32 internal constant CLONE_SIGHAND = 0x800;
    uint32 internal constant CLONE_PTRACE = 0x2000;
    uint32 internal constant CLONE_VFORK = 0x4000;
    uint32 internal constant CLONE_PARENT = 0x8000;
    uint32 internal constant CLONE_THREAD = 0x10000;
    uint32 internal constant CLONE_NEWNS = 0x20000;
    uint32 internal constant CLONE_SYSVSEM = 0x40000;
    uint32 internal constant CLONE_SETTLS = 0x80000;
    uint32 internal constant CLONE_PARENTSETTID = 0x100000;
    uint32 internal constant CLONE_CHILDCLEARTID = 0x200000;
    uint32 internal constant CLONE_UNTRACED = 0x800000;
    uint32 internal constant CLONE_CHILDSETTID = 0x1000000;
    uint32 internal constant CLONE_STOPPED = 0x2000000;
    uint32 internal constant CLONE_NEWUTS = 0x4000000;
    uint32 internal constant CLONE_NEWIPC = 0x8000000;
    uint32 internal constant VALID_SYS_CLONE_FLAGS =
        CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGHAND | CLONE_SYSVSEM | CLONE_THREAD;

    /// @notice Extract syscall num and arguments from registers.
    /// @param _registers The cpu registers.
    /// @return sysCallNum_ The syscall number.
    /// @return a0_ The first argument available to the syscall operation.
    /// @return a1_ The second argument available to the syscall operation.
    /// @return a2_ The third argument available to the syscall operation.
    /// @return a3_ The fourth argument available to the syscall operation.
    function getSyscallArgs(uint32[32] memory _registers)
        internal
        pure
        returns (uint32 sysCallNum_, uint32 a0_, uint32 a1_, uint32 a2_, uint32 a3_)
    {
        unchecked {
            sysCallNum_ = _registers[2];

            a0_ = _registers[4];
            a1_ = _registers[5];
            a2_ = _registers[6];
            a3_ = _registers[7];

            return (sysCallNum_, a0_, a1_, a2_, a3_);
        }
    }

    /// @notice Like a Linux mmap syscall. Allocates a page from the heap.
    /// @param _a0 The address for the new mapping
    /// @param _a1 The size of the new mapping
    /// @param _heap The current value of the heap pointer
    /// @return v0_ The address of the new mapping
    /// @return v1_ Unused error code (0)
    /// @return newHeap_ The new value for the heap, may be unchanged
    function handleSysMmap(
        uint32 _a0,
        uint32 _a1,
        uint32 _heap
    )
        internal
        pure
        returns (uint32 v0_, uint32 v1_, uint32 newHeap_)
    {
        unchecked {
            v1_ = uint32(0);
            newHeap_ = _heap;

            uint32 sz = _a1;
            if (sz & 4095 != 0) {
                // adjust size to align with page size
                sz += 4096 - (sz & 4095);
            }
            if (_a0 == 0) {
                v0_ = _heap;
                newHeap_ += sz;
                // Fail if new heap exceeds memory limit, newHeap overflows to low memory, or sz overflows
                if (newHeap_ > HEAP_END || newHeap_ < _heap || sz < _a1) {
                    v0_ = SYS_ERROR_SIGNAL;
                    v1_ = EINVAL;
                    return (v0_, v1_, _heap);
                }
            } else {
                v0_ = _a0;
            }

            return (v0_, v1_, newHeap_);
        }
    }

    /// @notice Like a Linux read syscall. Splits unaligned reads into aligned reads.
    ///         Args are provided as a struct to reduce stack pressure.
    /// @return v0_ The number of bytes read, -1 on error.
    /// @return v1_ The error code, 0 if there is no error.
    /// @return newPreimageOffset_ The new value for the preimage offset.
    /// @return newMemRoot_ The new memory root.
    function handleSysRead(SysReadParams memory _args)
        internal
        view
        returns (uint32 v0_, uint32 v1_, uint32 newPreimageOffset_, bytes32 newMemRoot_)
    {
        unchecked {
            v0_ = uint32(0);
            v1_ = uint32(0);
            newMemRoot_ = _args.memRoot;
            newPreimageOffset_ = _args.preimageOffset;

            // args: _a0 = fd, _a1 = addr, _a2 = count
            // returns: v0_ = read, v1_ = err code
            if (_args.a0 == FD_STDIN) {
                // Leave v0_ and v1_ zero: read nothing, no error
            }
            // pre-image oracle read
            else if (_args.a0 == FD_PREIMAGE_READ) {
                // verify proof is correct, and get the existing memory.
                // mask the addr to align it to 4 bytes
                uint32 mem = MIPSMemory.readMem(_args.memRoot, _args.a1 & 0xFFffFFfc, _args.proofOffset);
                // If the preimage key is a local key, localize it in the context of the caller.
                if (uint8(_args.preimageKey[0]) == 1) {
                    _args.preimageKey = PreimageKeyLib.localize(_args.preimageKey, _args.localContext);
                }
                (bytes32 dat, uint256 datLen) = _args.oracle.readPreimage(_args.preimageKey, _args.preimageOffset);

                // Transform data for writing to memory
                // We use assembly for more precise ops, and no var count limit
                uint32 a1 = _args.a1;
                uint32 a2 = _args.a2;
                assembly {
                    let alignment := and(a1, 3) // the read might not start at an aligned address
                    let space := sub(4, alignment) // remaining space in memory word
                    if lt(space, datLen) { datLen := space } // if less space than data, shorten data
                    if lt(a2, datLen) { datLen := a2 } // if requested to read less, read less
                    dat := shr(sub(256, mul(datLen, 8)), dat) // right-align data
                    dat := shl(mul(sub(sub(4, datLen), alignment), 8), dat) // position data to insert into memory
                    // word
                    let mask := sub(shl(mul(sub(4, alignment), 8), 1), 1) // mask all bytes after start
                    let suffixMask := sub(shl(mul(sub(sub(4, alignment), datLen), 8), 1), 1) // mask of all bytes
                    // starting from end, maybe none
                    mask := and(mask, not(suffixMask)) // reduce mask to just cover the data we insert
                    mem := or(and(mem, not(mask)), dat) // clear masked part of original memory, and insert data
                }

                // Write memory back
                newMemRoot_ = MIPSMemory.writeMem(_args.a1 & 0xFFffFFfc, _args.proofOffset, mem);
                newPreimageOffset_ += uint32(datLen);
                v0_ = uint32(datLen);
            }
            // hint response
            else if (_args.a0 == FD_HINT_READ) {
                // Don't read into memory, just say we read it all
                // The result is ignored anyway
                v0_ = _args.a2;
            } else {
                v0_ = 0xFFffFFff;
                v1_ = EBADF;
            }

            return (v0_, v1_, newPreimageOffset_, newMemRoot_);
        }
    }

    /// @notice Like a Linux write syscall. Splits unaligned writes into aligned writes.
    /// @param _a0 The file descriptor.
    /// @param _a1 The memory address to read from.
    /// @param _a2 The number of bytes to read.
    /// @param _preimageKey The current preimaageKey.
    /// @param _preimageOffset The current preimageOffset.
    /// @param _proofOffset The offset of the memory proof in calldata.
    /// @param _memRoot The current memory root.
    /// @return v0_ The number of bytes written, or -1 on error.
    /// @return v1_ The error code, or 0 if empty.
    /// @return newPreimageKey_ The new preimageKey.
    /// @return newPreimageOffset_ The new preimageOffset.
    function handleSysWrite(
        uint32 _a0,
        uint32 _a1,
        uint32 _a2,
        bytes32 _preimageKey,
        uint32 _preimageOffset,
        uint256 _proofOffset,
        bytes32 _memRoot
    )
        internal
        pure
        returns (uint32 v0_, uint32 v1_, bytes32 newPreimageKey_, uint32 newPreimageOffset_)
    {
        unchecked {
            // args: _a0 = fd, _a1 = addr, _a2 = count
            // returns: v0_ = written, v1_ = err code
            v0_ = uint32(0);
            v1_ = uint32(0);
            newPreimageKey_ = _preimageKey;
            newPreimageOffset_ = _preimageOffset;

            if (_a0 == FD_STDOUT || _a0 == FD_STDERR || _a0 == FD_HINT_WRITE) {
                v0_ = _a2; // tell program we have written everything
            }
            // pre-image oracle
            else if (_a0 == FD_PREIMAGE_WRITE) {
                // mask the addr to align it to 4 bytes
                uint32 mem = MIPSMemory.readMem(_memRoot, _a1 & 0xFFffFFfc, _proofOffset);
                bytes32 key = _preimageKey;

                // Construct pre-image key from memory
                // We use assembly for more precise ops, and no var count limit
                assembly {
                    let alignment := and(_a1, 3) // the read might not start at an aligned address
                    let space := sub(4, alignment) // remaining space in memory word
                    if lt(space, _a2) { _a2 := space } // if less space than data, shorten data
                    key := shl(mul(_a2, 8), key) // shift key, make space for new info
                    let mask := sub(shl(mul(_a2, 8), 1), 1) // mask for extracting value from memory
                    mem := and(shr(mul(sub(space, _a2), 8), mem), mask) // align value to right, mask it
                    key := or(key, mem) // insert into key
                }

                // Write pre-image key to oracle
                newPreimageKey_ = key;
                newPreimageOffset_ = 0; // reset offset, to read new pre-image data from the start
                v0_ = _a2;
            } else {
                v0_ = 0xFFffFFff;
                v1_ = EBADF;
            }

            return (v0_, v1_, newPreimageKey_, newPreimageOffset_);
        }
    }

    /// @notice Like Linux fcntl (file control) syscall, but only supports minimal file-descriptor control commands, to
    /// retrieve the file-descriptor R/W flags.
    /// @param _a0 The file descriptor.
    /// @param _a1 The control command.
    /// @param v0_ The file status flag (only supported command is F_GETFL), or -1 on error.
    /// @param v1_ An error number, or 0 if there is no error.
    function handleSysFcntl(uint32 _a0, uint32 _a1) internal pure returns (uint32 v0_, uint32 v1_) {
        unchecked {
            v0_ = uint32(0);
            v1_ = uint32(0);

            // args: _a0 = fd, _a1 = cmd
            if (_a1 == 3) {
                // F_GETFL: get file descriptor flags
                if (_a0 == FD_STDIN || _a0 == FD_PREIMAGE_READ || _a0 == FD_HINT_READ) {
                    v0_ = 0; // O_RDONLY
                } else if (_a0 == FD_STDOUT || _a0 == FD_STDERR || _a0 == FD_PREIMAGE_WRITE || _a0 == FD_HINT_WRITE) {
                    v0_ = 1; // O_WRONLY
                } else {
                    v0_ = 0xFFffFFff;
                    v1_ = EBADF;
                }
            } else {
                v0_ = 0xFFffFFff;
                v1_ = EINVAL; // cmd not recognized by this kernel
            }

            return (v0_, v1_);
        }
    }

    function handleSyscallUpdates(
        st.CpuScalars memory _cpu,
        uint32[32] memory _registers,
        uint32 _v0,
        uint32 _v1
    )
        internal
        pure
    {
        unchecked {
            // Write the results back to the state registers
            _registers[2] = _v0;
            _registers[7] = _v1;

            // Update the PC and nextPC
            _cpu.pc = _cpu.nextPC;
            _cpu.nextPC = _cpu.nextPC + 4;
        }
    }
}

interface ISemver {
    /// @notice Getter for the semantic version of the contract. This is not
    ///         meant to be used onchain but instead meant to be used by offchain
    ///         tooling.
    /// @return Semver contract version as a string.
    function version() external view returns (string memory);
}

contract MIPS is ISemver {
    /// @notice Stores the VM state.
    ///         Total state size: 32 + 32 + 6 * 4 + 1 + 1 + 8 + 32 * 4 = 226 bytes
    ///         If nextPC != pc + 4, then the VM is executing a branch/jump delay slot.
    struct State {
        bytes32 memRoot;
        bytes32 preimageKey;
        uint32 preimageOffset;
        uint32 pc;
        uint32 nextPC;
        uint32 lo;
        uint32 hi;
        uint32 heap;
        uint8 exitCode;
        bool exited;
        uint64 step;
        uint32[32] registers;
    }

    /// @notice The semantic version of the MIPS contract.
    /// @custom:semver 1.1.0
    string public constant version = "1.1.0";

    /// @notice The preimage oracle contract.
    IPreimageOracle internal immutable ORACLE;

    // The offset of the start of proof calldata (_proof.offset) in the step() function
    uint256 internal constant STEP_PROOF_OFFSET = 420;

    /// @param _oracle The address of the preimage oracle contract.
    constructor(IPreimageOracle _oracle) {
        ORACLE = _oracle;
    }

    /// @notice Getter for the pre-image oracle contract.
    /// @return oracle_ The IPreimageOracle contract.
    function oracle() external view returns (IPreimageOracle oracle_) {
        oracle_ = ORACLE;
    }

    /// @notice Computes the hash of the MIPS state.
    /// @return out_ The hashed MIPS state.
    function outputState() internal returns (bytes32 out_) {
        assembly {
            // copies 'size' bytes, right-aligned in word at 'from', to 'to', incl. trailing data
            function copyMem(from, to, size) -> fromOut, toOut {
                mstore(to, mload(add(from, sub(32, size))))
                fromOut := add(from, 32)
                toOut := add(to, size)
            }

            // From points to the MIPS State
            let from := 0x80

            // Copy to the free memory pointer
            let start := mload(0x40)
            let to := start

            // Copy state to free memory
            from, to := copyMem(from, to, 32) // memRoot
            from, to := copyMem(from, to, 32) // preimageKey
            from, to := copyMem(from, to, 4) // preimageOffset
            from, to := copyMem(from, to, 4) // pc
            from, to := copyMem(from, to, 4) // nextPC
            from, to := copyMem(from, to, 4) // lo
            from, to := copyMem(from, to, 4) // hi
            from, to := copyMem(from, to, 4) // heap
            let exitCode := mload(from)
            from, to := copyMem(from, to, 1) // exitCode
            let exited := mload(from)
            from, to := copyMem(from, to, 1) // exited
            from, to := copyMem(from, to, 8) // step
            from := add(from, 32) // offset to registers

            // Verify that the value of exited is valid (0 or 1)
            if gt(exited, 1) {
                // revert InvalidExitedValue();
                let ptr := mload(0x40)
                mstore(ptr, shl(224, 0x0136cc76))
                revert(ptr, 0x04)
            }

            // Copy registers
            for { let i := 0 } lt(i, 32) { i := add(i, 1) } { from, to := copyMem(from, to, 4) }

            // Clean up end of memory
            mstore(to, 0)

            // Log the resulting MIPS state, for debugging
            log0(start, sub(to, start))

            // Determine the VM status
            let status := 0
            switch exited
            case 1 {
                switch exitCode
                // VMStatusValid
                case 0 { status := 0 }
                // VMStatusInvalid
                case 1 { status := 1 }
                // VMStatusPanic
                default { status := 2 }
            }
            // VMStatusUnfinished
            default { status := 3 }

            // Compute the hash of the resulting MIPS state and set the status byte
            out_ := keccak256(start, sub(to, start))
            out_ := or(and(not(shl(248, 0xFF)), out_), shl(248, status))
        }
    }

    /// @notice Handles a syscall.
    /// @param _localContext The local key context for the preimage oracle.
    /// @return out_ The hashed MIPS state.
    function handleSyscall(bytes32 _localContext) internal returns (bytes32 out_) {
        unchecked {
            // Load state from memory
            State memory state;
            assembly {
                state := 0x80
            }

            // Load the syscall numbers and args from the registers
            (uint32 syscall_no, uint32 a0, uint32 a1, uint32 a2,) = sys.getSyscallArgs(state.registers);

            uint32 v0 = 0;
            uint32 v1 = 0;

            if (syscall_no == sys.SYS_MMAP) {
                (v0, v1, state.heap) = sys.handleSysMmap(a0, a1, state.heap);
            } else if (syscall_no == sys.SYS_BRK) {
                // brk: Returns a fixed address for the program break at 0x40000000
                v0 = sys.PROGRAM_BREAK;
            } else if (syscall_no == sys.SYS_CLONE) {
                // clone (not supported) returns 1
                v0 = 1;
            } else if (syscall_no == sys.SYS_EXIT_GROUP) {
                // exit group: Sets the Exited and ExitCode states to true and argument 0.
                state.exited = true;
                state.exitCode = uint8(a0);
                return outputState();
            } else if (syscall_no == sys.SYS_READ) {
                sys.SysReadParams memory args = sys.SysReadParams({
                    a0: a0,
                    a1: a1,
                    a2: a2,
                    preimageKey: state.preimageKey,
                    preimageOffset: state.preimageOffset,
                    localContext: _localContext,
                    oracle: ORACLE,
                    proofOffset: MIPSMemory.memoryProofOffset(STEP_PROOF_OFFSET, 1),
                    memRoot: state.memRoot
                });
                (v0, v1, state.preimageOffset, state.memRoot) = sys.handleSysRead(args);
            } else if (syscall_no == sys.SYS_WRITE) {
                (v0, v1, state.preimageKey, state.preimageOffset) = sys.handleSysWrite({
                    _a0: a0,
                    _a1: a1,
                    _a2: a2,
                    _preimageKey: state.preimageKey,
                    _preimageOffset: state.preimageOffset,
                    _proofOffset: MIPSMemory.memoryProofOffset(STEP_PROOF_OFFSET, 1),
                    _memRoot: state.memRoot
                });
            } else if (syscall_no == sys.SYS_FCNTL) {
                (v0, v1) = sys.handleSysFcntl(a0, a1);
            }

            st.CpuScalars memory cpu = getCpuScalars(state);
            sys.handleSyscallUpdates(cpu, state.registers, v0, v1);
            setStateCpuScalars(state, cpu);

            out_ = outputState();
        }
    }

    /// @notice Executes a single step of the vm.
    ///         Will revert if any required input state is missing.
    /// @param _stateData The encoded state witness data.
    /// @param _proof The encoded proof data for leaves within the MIPS VM's memory.
    /// @param _localContext The local key context for the preimage oracle. Optional, can be set as a constant
    ///                      if the caller only requires one set of local keys.
    function step(bytes calldata _stateData, bytes calldata _proof, bytes32 _localContext) public returns (bytes32) {
        unchecked {
            State memory state;

            // Packed calldata is ~6 times smaller than state size
            assembly {
                if iszero(eq(state, 0x80)) {
                    // expected state mem offset check
                    revert(0, 0)
                }
                if iszero(eq(mload(0x40), shl(5, 48))) {
                    // expected memory check
                    revert(0, 0)
                }
                if iszero(eq(_stateData.offset, 132)) {
                    // 32*4+4=132 expected state data offset
                    revert(0, 0)
                }
                if iszero(eq(_proof.offset, STEP_PROOF_OFFSET)) {
                    // 132+32+256=420 expected proof offset
                    revert(0, 0)
                }

                function putField(callOffset, memOffset, size) -> callOffsetOut, memOffsetOut {
                    // calldata is packed, thus starting left-aligned, shift-right to pad and right-align
                    let w := shr(shl(3, sub(32, size)), calldataload(callOffset))
                    mstore(memOffset, w)
                    callOffsetOut := add(callOffset, size)
                    memOffsetOut := add(memOffset, 32)
                }

                // Unpack state from calldata into memory
                let c := _stateData.offset // calldata offset
                let m := 0x80 // mem offset
                c, m := putField(c, m, 32) // memRoot
                c, m := putField(c, m, 32) // preimageKey
                c, m := putField(c, m, 4) // preimageOffset
                c, m := putField(c, m, 4) // pc
                c, m := putField(c, m, 4) // nextPC
                c, m := putField(c, m, 4) // lo
                c, m := putField(c, m, 4) // hi
                c, m := putField(c, m, 4) // heap
                c, m := putField(c, m, 1) // exitCode
                c, m := putField(c, m, 1) // exited
                let exited := mload(sub(m, 32))
                c, m := putField(c, m, 8) // step

                // Verify that the value of exited is valid (0 or 1)
                if gt(exited, 1) {
                    // revert InvalidExitedValue();
                    let ptr := mload(0x40)
                    mstore(ptr, shl(224, 0x0136cc76))
                    revert(ptr, 0x04)
                }

                // Compiler should have done this already
                if iszero(eq(mload(m), add(m, 32))) {
                    // expected registers offset check
                    revert(0, 0)
                }

                // Unpack register calldata into memory
                m := add(m, 32)
                for { let i := 0 } lt(i, 32) { i := add(i, 1) } { c, m := putField(c, m, 4) }
            }

            // Don't change state once exited
            if (state.exited) {
                return outputState();
            }

            state.step += 1;

            // instruction fetch
            uint256 insnProofOffset = MIPSMemory.memoryProofOffset(STEP_PROOF_OFFSET, 0);
            (uint32 insn, uint32 opcode, uint32 fun) =
                ins.getInstructionDetails(state.pc, state.memRoot, insnProofOffset);

            // Handle syscall separately
            // syscall (can read and write)
            if (opcode == 0 && fun == 0xC) {
                return handleSyscall(_localContext);
            }

            // Exec the rest of the step logic
            st.CpuScalars memory cpu = getCpuScalars(state);
            (state.memRoot) = ins.execMipsCoreStepLogic({
                _cpu: cpu,
                _registers: state.registers,
                _memRoot: state.memRoot,
                _memProofOffset: MIPSMemory.memoryProofOffset(STEP_PROOF_OFFSET, 1),
                _insn: insn,
                _opcode: opcode,
                _fun: fun
            });
            setStateCpuScalars(state, cpu);

            return outputState();
        }
    }

    function getCpuScalars(State memory _state) internal pure returns (st.CpuScalars memory) {
        return st.CpuScalars({ pc: _state.pc, nextPC: _state.nextPC, lo: _state.lo, hi: _state.hi });
    }

    function setStateCpuScalars(State memory _state, st.CpuScalars memory _cpu) internal pure {
        _state.pc = _cpu.pc;
        _state.nextPC = _cpu.nextPC;
        _state.lo = _cpu.lo;
        _state.hi = _cpu.hi;
    }
}