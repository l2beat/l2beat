import type { Bytes } from '../types/Bytes.js'

// Reference: https://www.evm.codes/
const OPCODES: Record<number, string> = {
  0x00: 'STOP',
  0x01: 'ADD',
  0x02: 'MUL',
  0x03: 'SUB',
  0x04: 'DIV',
  0x05: 'SDIV',
  0x06: 'MOD',
  0x07: 'SMOD',
  0x08: 'ADDMOD',
  0x09: 'MULMOD',
  0x0a: 'EXP',
  0x0b: 'SIGNEXTEND',
  0x10: 'LT',
  0x11: 'GT',
  0x12: 'SLT',
  0x13: 'SGT',
  0x14: 'EQ',
  0x15: 'ISZERO',
  0x16: 'AND',
  0x17: 'OR',
  0x18: 'XOR',
  0x19: 'NOT',
  0x1a: 'BYTE',
  0x1b: 'SHL',
  0x1c: 'SHR',
  0x1d: 'SAR',
  0x1e: 'CLZ',
  0x20: 'KECCAK256',
  0x30: 'ADDRESS',
  0x31: 'BALANCE',
  0x32: 'ORIGIN',
  0x33: 'CALLER',
  0x34: 'CALLVALUE',
  0x35: 'CALLDATALOAD',
  0x36: 'CALLDATASIZE',
  0x37: 'CALLDATACOPY',
  0x38: 'CODESIZE',
  0x39: 'CODECOPY',
  0x3a: 'GASPRICE',
  0x3b: 'EXTCODESIZE',
  0x3c: 'EXTCODECOPY',
  0x3d: 'RETURNDATASIZE',
  0x3e: 'RETURNDATACOPY',
  0x3f: 'EXTCODEHASH',
  0x40: 'BLOCKHASH',
  0x41: 'COINBASE',
  0x42: 'TIMESTAMP',
  0x43: 'NUMBER',
  0x44: 'PREVRANDAO',
  0x45: 'GASLIMIT',
  0x46: 'CHAINID',
  0x47: 'SELFBALANCE',
  0x48: 'BASEFEE',
  0x49: 'BLOBHASH',
  0x4a: 'BLOBBASEFEE',
  0x50: 'POP',
  0x51: 'MLOAD',
  0x52: 'MSTORE',
  0x53: 'MSTORE8',
  0x54: 'SLOAD',
  0x55: 'SSTORE',
  0x56: 'JUMP',
  0x57: 'JUMPI',
  0x58: 'PC',
  0x59: 'MSIZE',
  0x5a: 'GAS',
  0x5b: 'JUMPDEST',
  0x5c: 'TLOAD',
  0x5d: 'TSTORE',
  0x5e: 'MCOPY',
  0x5f: 'PUSH0',
  0xe6: 'DUPN',
  0xe7: 'SWAPN',
  0xe8: 'EXCHANGE',
  0xf0: 'CREATE',
  0xf1: 'CALL',
  0xf2: 'CALLCODE',
  0xf3: 'RETURN',
  0xf4: 'DELEGATECALL',
  0xf5: 'CREATE2',
  0xfa: 'STATICCALL',
  0xfd: 'REVERT',
  0xfe: 'INVALID',
  0xff: 'SELFDESTRUCT',
}

// PUSH1-PUSH32 (0x60-0x7f), DUP1-DUP16 (0x80-0x8f), SWAP1-SWAP16 (0x90-0x9f), LOG0-LOG4 (0xa0-0xa4)
for (let i = 0; i < 32; i++) OPCODES[0x60 + i] = `PUSH${i + 1}`
for (let i = 0; i < 16; i++) OPCODES[0x80 + i] = `DUP${i + 1}`
for (let i = 0; i < 16; i++) OPCODES[0x90 + i] = `SWAP${i + 1}`
for (let i = 0; i < 5; i++) OPCODES[0xa0 + i] = `LOG${i}`

export interface Instruction {
  offset: number
  opcode: number
  mnemonic: string
  immediate?: string // hex string for PUSH1-32, DUPN, SWAPN and EXCHANGE
}

export function disasmEVM(bytecode: Bytes): Instruction[] {
  const code = Buffer.from(bytecode.toString().replace(/^0x/, ''), 'hex')
  const instructions: Instruction[] = []
  let i = 0

  while (i < code.length) {
    const opcode = code[i]
    const mnemonic = getMnemonic(code, i)
    const instruction: Instruction = { offset: i, opcode, mnemonic }

    const immediateLength = getImmediateLength(code, i)
    if (immediateLength > 0) {
      const data = code.subarray(i + 1, i + 1 + immediateLength)
      instruction.immediate =
        '0x' +
        Buffer.from(data)
          .toString('hex')
          .padStart(immediateLength * 2, '0')
      i += immediateLength
    }

    instructions.push(instruction)
    i++
  }

  return instructions
}

function getMnemonic(code: Buffer, offset: number): string {
  const opcode = code[offset]
  const mnemonic = OPCODES[opcode]
  if (mnemonic === undefined) {
    return `UNKNOWN(0x${opcode.toString(16).padStart(2, '0').toUpperCase()})`
  }
  if (hasDisallowedImmediate(code, offset)) {
    return `INVALID_${mnemonic}`
  }
  return mnemonic
}

function getImmediateLength(code: Buffer, offset: number): number {
  const opcode = code[offset]
  // PUSH1 (0x60) through PUSH32 (0x7f)
  if (opcode >= 0x60 && opcode <= 0x7f) {
    return opcode - 0x5f
  }
  if (isEIP8024Opcode(opcode)) {
    if (hasDisallowedImmediate(code, offset)) {
      return 0
    }
    return 1
  }
  return 0
}

// EIP-8024: DUPN (0xe6), SWAPN (0xe7), EXCHANGE (0xe8)
function isEIP8024Opcode(opcode: number): boolean {
  return opcode >= 0xe6 && opcode <= 0xe8
}

// JUMPDEST analysis does not skip EIP-8024 immediates, so the spec forbids
// JUMPDEST and PUSH1-32 (0x5b-0x7f) there. Such a byte starts the next
// instruction, which keeps the disassembly aligned with JUMPDEST analysis.
function hasDisallowedImmediate(code: Buffer, offset: number): boolean {
  if (!isEIP8024Opcode(code[offset])) {
    return false
  }
  const immediate = code[offset + 1]
  if (immediate === undefined) {
    return false
  }
  return immediate >= 0x5b && immediate <= 0x7f
}

export function formatEVMOpcodes(instructions: Instruction[]): string {
  if (instructions.length === 0) return ''

  const maxOffset = Math.max(...instructions.map((i) => i.offset))
  const hexLength = maxOffset.toString(16).length
  const width = Math.max(2, hexLength % 2 === 0 ? hexLength : hexLength + 1)

  return instructions
    .map((i) => {
      const offset = i.offset.toString(16).padStart(width, '0')
      const immediatePart = i.immediate ? ` ${i.immediate}` : ''
      return `${offset}: ${i.mnemonic}${immediatePart}`
    })
    .join('\n')
}
