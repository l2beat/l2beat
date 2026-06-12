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
  pushData?: string // hex string for PUSH opcodes
}

export function disasmEVM(bytecode: Bytes): Instruction[] {
  const code = Buffer.from(bytecode.toString().replace(/^0x/, ''), 'hex')
  const instructions: Instruction[] = []
  let i = 0

  while (i < code.length) {
    const opcode = code[i]
    const mnemonic =
      OPCODES[opcode] ??
      `UNKNOWN(0x${opcode.toString(16).padStart(2, '0').toUpperCase()})`
    const instr: Instruction = { offset: i, opcode, mnemonic }

    // PUSH1 (0x60) through PUSH32 (0x7f)
    if (opcode >= 0x60 && opcode <= 0x7f) {
      const n = opcode - 0x5f
      const data = code.subarray(i + 1, i + 1 + n)
      instr.pushData =
        '0x' +
        Buffer.from(data)
          .toString('hex')
          .padStart(n * 2, '0')
      i += n
    }

    instructions.push(instr)
    i++
  }

  return instructions
}

export function formatEVMOpcodes(instructions: Instruction[]): string {
  if (instructions.length === 0) return ''

  const maxOffset = Math.max(...instructions.map((i) => i.offset))
  const hexLength = maxOffset.toString(16).length
  const width = Math.max(2, hexLength % 2 === 0 ? hexLength : hexLength + 1)

  return instructions
    .map((i) => {
      const offset = i.offset.toString(16).padStart(width, '0')
      const pushPart = i.pushData ? ` ${i.pushData}` : ''
      return `${offset}: ${i.mnemonic}${pushPart}`
    })
    .join('\n')
}
