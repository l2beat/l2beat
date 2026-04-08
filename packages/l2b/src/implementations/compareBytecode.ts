import chalk from 'chalk'
import { diffLines } from 'diff'
import type { ImmutableReference } from './solc'

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
  0x20: 'SHA3',
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

for (let i = 0; i < 32; i++) {
  OPCODES[0x60 + i] = `PUSH${i + 1}`
}

for (let i = 0; i < 16; i++) {
  OPCODES[0x80 + i] = `DUP${i + 1}`
  OPCODES[0x90 + i] = `SWAP${i + 1}`
}

for (let i = 0; i < 5; i++) {
  OPCODES[0xa0 + i] = `LOG${i}`
}

interface Instruction {
  offset: number
  mnemonic: string
  pushData?: string
  size: number
}

interface SolidityMetadata {
  solc: string
  ipfs?: string
  bzzr0?: string
  bzzr1?: string
  experimental?: boolean
}

interface MetadataSection {
  start: number
  end: number
  metadata: SolidityMetadata
}

interface BytecodeView {
  originalHex: string
  metadataSections: MetadataSection[]
  comparableHex: string
  comparableOffsets: number[]
}

interface Cursor {
  offset: number
}

type CborScalar = boolean | Buffer | number | string

interface RenderedLine {
  start: number
  end: number
  text: string
}

export type VerificationResult =
  | { status: 'match' }
  | { status: 'match-with-immutables'; immutableCount: number }
  | { status: 'mismatch'; detail: string }

export function compareBytecodes(
  compiledHex: string,
  deployedHex: string,
  immutableReferences: Record<string, ImmutableReference[]>,
): VerificationResult {
  const compiled = buildBytecodeView(normalize(compiledHex))
  const deployed = buildBytecodeView(normalize(deployedHex))

  if (compiled.comparableHex === deployed.comparableHex) {
    return { status: 'match' }
  }

  const allRefs = Object.values(immutableReferences).flat()
  if (allRefs.length === 0) {
    return {
      status: 'mismatch',
      detail: describeMismatch(compiled, deployed),
    }
  }

  const maskedCompiled = buildBytecodeView(
    maskImmutables(compiled.originalHex, allRefs),
    compiled.metadataSections,
  )
  const maskedDeployed = buildBytecodeView(
    maskImmutables(deployed.originalHex, allRefs),
    deployed.metadataSections,
  )

  if (maskedCompiled.comparableHex === maskedDeployed.comparableHex) {
    return {
      status: 'match-with-immutables',
      immutableCount: allRefs.length,
    }
  }

  return {
    status: 'mismatch',
    detail: describeMismatchWithImmutables(
      compiled,
      deployed,
      maskedCompiled,
      maskedDeployed,
      allRefs.length,
    ),
  }
}

function normalize(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2).toLowerCase() : hex.toLowerCase()
}

export function stripMetadata(bytecodeHex: string): string {
  const normalized = normalize(bytecodeHex)
  const metadataSections = findMetadataSections(normalized)
  return removeMetadataSections(normalized, metadataSections).comparableHex
}

function buildBytecodeView(
  bytecodeHex: string,
  metadataSections = findMetadataSections(bytecodeHex),
): BytecodeView {
  const { comparableHex, comparableOffsets } = removeMetadataSections(
    bytecodeHex,
    metadataSections,
  )

  return {
    originalHex: bytecodeHex,
    metadataSections,
    comparableHex,
    comparableOffsets,
  }
}

function findMetadataSections(bytecodeHex: string): MetadataSection[] {
  const code = Buffer.from(bytecodeHex, 'hex')
  const candidates: MetadataSection[] = []

  for (let end = 4; end <= code.length; end++) {
    const candidate = decodeMetadataSection(code, end)
    if (candidate !== undefined) {
      candidates.push(candidate)
    }
  }

  candidates.sort((a, b) => a.start - b.start || b.end - a.end)

  const sections: MetadataSection[] = []
  for (const candidate of candidates) {
    const last = sections.at(-1)
    if (last === undefined || candidate.start >= last.end) {
      sections.push(candidate)
    }
  }

  return sections
}

function decodeMetadataSection(
  code: Buffer,
  end: number,
): MetadataSection | undefined {
  const metadataLength = code.readUInt16BE(end - 2)
  const start = end - 2 - metadataLength
  if (start < 0) {
    return undefined
  }

  const metadata = decodeSolidityMetadata(code.subarray(start, end - 2))
  if (metadata === undefined) {
    return undefined
  }

  return { start, end, metadata }
}

function decodeSolidityMetadata(
  encoded: Buffer,
): SolidityMetadata | undefined {
  const cursor = { offset: 0 }
  const entryCount = readCborContainerLength(encoded, cursor, 5)
  if (entryCount === undefined || entryCount === 0) {
    return undefined
  }

  const metadata: Partial<SolidityMetadata> = {}
  let hasSolc = false

  for (let i = 0; i < entryCount; i++) {
    const key = readCborText(encoded, cursor)
    const value = readCborScalar(encoded, cursor)
    if (key === undefined || value === undefined) {
      return undefined
    }

    if (key === 'solc') {
      const solc = decodeSolcVersion(value)
      if (solc === undefined) {
        return undefined
      }
      metadata.solc = solc
      hasSolc = true
      continue
    }

    if (key === 'ipfs') {
      const ipfs = decodeMetadataHash(value, 34)
      if (ipfs === undefined) {
        return undefined
      }
      metadata.ipfs = ipfs
      continue
    }

    if (key === 'bzzr0') {
      const bzzr0 = decodeMetadataHash(value, 32)
      if (bzzr0 === undefined) {
        return undefined
      }
      metadata.bzzr0 = bzzr0
      continue
    }

    if (key === 'bzzr1') {
      const bzzr1 = decodeMetadataHash(value, 32)
      if (bzzr1 === undefined) {
        return undefined
      }
      metadata.bzzr1 = bzzr1
      continue
    }

    if (key === 'experimental') {
      if (typeof value !== 'boolean') {
        return undefined
      }
      metadata.experimental = value
    }
  }

  if (!hasSolc || cursor.offset !== encoded.length) {
    return undefined
  }

  return metadata as SolidityMetadata
}

function readCborContainerLength(
  encoded: Buffer,
  cursor: Cursor,
  expectedMajorType: number,
): number | undefined {
  if (cursor.offset >= encoded.length) {
    return undefined
  }

  const initialByte = encoded[cursor.offset++]
  const majorType = initialByte >> 5
  const additionalInfo = initialByte & 0x1f
  if (majorType !== expectedMajorType) {
    return undefined
  }

  return readCborLength(encoded, cursor, additionalInfo)
}

function readCborText(encoded: Buffer, cursor: Cursor): string | undefined {
  if (cursor.offset >= encoded.length) {
    return undefined
  }

  const initialByte = encoded[cursor.offset++]
  const majorType = initialByte >> 5
  const additionalInfo = initialByte & 0x1f
  if (majorType !== 3) {
    return undefined
  }

  const length = readCborLength(encoded, cursor, additionalInfo)
  if (length === undefined || cursor.offset + length > encoded.length) {
    return undefined
  }

  const value = encoded.toString('utf8', cursor.offset, cursor.offset + length)
  cursor.offset += length
  return value
}

function readCborScalar(
  encoded: Buffer,
  cursor: Cursor,
): CborScalar | undefined {
  if (cursor.offset >= encoded.length) {
    return undefined
  }

  const initialByte = encoded[cursor.offset++]
  const majorType = initialByte >> 5
  const additionalInfo = initialByte & 0x1f

  if (majorType === 0) {
    return readCborLength(encoded, cursor, additionalInfo)
  }

  if (majorType === 2 || majorType === 3) {
    const length = readCborLength(encoded, cursor, additionalInfo)
    if (length === undefined || cursor.offset + length > encoded.length) {
      return undefined
    }

    const value = encoded.subarray(cursor.offset, cursor.offset + length)
    cursor.offset += length
    return majorType === 2 ? value : value.toString('utf8')
  }

  if (majorType === 7) {
    if (additionalInfo === 20) {
      return false
    }
    if (additionalInfo === 21) {
      return true
    }
  }

  return undefined
}

function readCborLength(
  encoded: Buffer,
  cursor: Cursor,
  additionalInfo: number,
): number | undefined {
  if (additionalInfo < 24) {
    return additionalInfo
  }

  if (additionalInfo === 24) {
    return readCborUint(encoded, cursor, 1)
  }

  if (additionalInfo === 25) {
    return readCborUint(encoded, cursor, 2)
  }

  if (additionalInfo === 26) {
    return readCborUint(encoded, cursor, 4)
  }

  if (additionalInfo === 27) {
    return readCborUint(encoded, cursor, 8)
  }

  return undefined
}

function readCborUint(
  encoded: Buffer,
  cursor: Cursor,
  byteLength: number,
): number | undefined {
  if (cursor.offset + byteLength > encoded.length) {
    return undefined
  }

  let value = 0
  for (let i = 0; i < byteLength; i++) {
    value = value * 256 + encoded[cursor.offset + i]
  }

  cursor.offset += byteLength
  if (!Number.isSafeInteger(value)) {
    return undefined
  }

  return value
}

function decodeSolcVersion(value: CborScalar): string | undefined {
  if (typeof value === 'string' && value !== '') {
    return value
  }

  if (!Buffer.isBuffer(value) || value.length !== 3) {
    return undefined
  }

  return `${value[0]}.${value[1]}.${value[2]}`
}

function decodeMetadataHash(
  value: CborScalar,
  expectedLength: number,
): string | undefined {
  if (!Buffer.isBuffer(value) || value.length !== expectedLength) {
    return undefined
  }

  return value.toString('hex')
}

function maskImmutables(
  bytecodeHex: string,
  refs: ImmutableReference[],
): string {
  const chars = bytecodeHex.split('')
  for (const ref of refs) {
    const hexStart = ref.start * 2
    const hexLen = ref.length * 2
    for (let i = hexStart; i < hexStart + hexLen && i < chars.length; i++) {
      chars[i] = '0'
    }
  }
  return chars.join('')
}

function removeMetadataSections(
  bytecodeHex: string,
  metadataSections: MetadataSection[],
): { comparableHex: string; comparableOffsets: number[] } {
  const byteLength = bytecodeHex.length / 2
  const comparableOffsets: number[] = []
  const chunks: string[] = []
  let current = 0

  for (const section of metadataSections) {
    if (current < section.start) {
      chunks.push(bytecodeHex.slice(current * 2, section.start * 2))
      for (let offset = current; offset < section.start; offset++) {
        comparableOffsets.push(offset)
      }
    }

    current = section.end
  }

  if (current < byteLength) {
    chunks.push(bytecodeHex.slice(current * 2))
    for (let offset = current; offset < byteLength; offset++) {
      comparableOffsets.push(offset)
    }
  }

  return {
    comparableHex: chunks.join(''),
    comparableOffsets,
  }
}

function describeMismatch(compiled: BytecodeView, deployed: BytecodeView): string {
  if (hasMetadata(compiled, deployed)) {
    return describeMismatchWithLabel(
      compiled,
      deployed,
      'after ignoring Solidity metadata, ',
    )
  }

  return describeMismatchWithLabel(compiled, deployed, '')
}

function hasMetadata(compiled: BytecodeView, deployed: BytecodeView): boolean {
  return compiled.metadataSections.length > 0 || deployed.metadataSections.length > 0
}

function describeMismatchWithImmutables(
  compiled: BytecodeView,
  deployed: BytecodeView,
  maskedCompiled: BytecodeView,
  maskedDeployed: BytecodeView,
  immutableCount: number,
): string {
  const maskedLabel = hasMetadata(compiled, deployed)
    ? `after ignoring Solidity metadata and masking ${immutableCount} immutable ref(s), `
    : `after masking ${immutableCount} immutable ref(s), `
  const rawLabel = hasMetadata(compiled, deployed)
    ? 'raw diff before masking immutables (Solidity metadata ignored): '
    : 'raw diff before masking immutables: '

  const maskedDetail = describeMismatchWithLabel(
    maskedCompiled,
    maskedDeployed,
    maskedLabel,
  )
  const rawDetail = describeMismatchWithLabel(compiled, deployed, rawLabel)
  return `${maskedDetail}\n${rawDetail}`
}

function describeMismatchWithLabel(
  compiled: BytecodeView,
  deployed: BytecodeView,
  label: string,
): string {
  if (compiled.comparableHex.length !== deployed.comparableHex.length) {
    return `${label}length differs: compiled=${compiled.comparableHex.length / 2} bytes, deployed=${deployed.comparableHex.length / 2} bytes`
  }

  let firstDiff = -1
  let diffCount = 0
  for (let i = 0; i < compiled.comparableHex.length; i += 2) {
    if (
      compiled.comparableHex.slice(i, i + 2) !==
      deployed.comparableHex.slice(i, i + 2)
    ) {
      if (firstDiff === -1) {
        firstDiff = i / 2
      }
      diffCount++
    }
  }

  const compiledOffset = comparableOffsetToOriginal(compiled, firstDiff)
  const deployedOffset = comparableOffsetToOriginal(deployed, firstDiff)
  const offsetLabel =
    compiledOffset === deployedOffset
      ? `first at offset ${compiledOffset}`
      : `first at compiled offset ${compiledOffset}, deployed offset ${deployedOffset}`
  const summary = `${label}${diffCount} byte(s) differ, ${offsetLabel}`
  const diff = formatDisassemblyDiff(
    compiled,
    deployed,
    compiledOffset,
    deployedOffset,
  )
  return `${summary}\n${diff}`
}

function comparableOffsetToOriginal(
  bytecode: BytecodeView,
  comparableOffset: number,
): number {
  const originalLength = bytecode.originalHex.length / 2
  return bytecode.comparableOffsets[comparableOffset] ?? originalLength
}

function formatDisassemblyDiff(
  compiled: BytecodeView,
  deployed: BytecodeView,
  compiledOffset: number,
  deployedOffset: number,
): string {
  const compiledWindow = getDiffWindow(
    compiled.originalHex.length / 2,
    compiledOffset,
  )
  const deployedWindow = getDiffWindow(
    deployed.originalHex.length / 2,
    deployedOffset,
  )

  const compiledDisassembly = formatRenderedLines(
    sliceRenderedLines(
      renderBytecode(compiled.originalHex, compiled.metadataSections),
      compiledWindow.start,
      compiledWindow.end,
    ),
  )
  const deployedDisassembly = formatRenderedLines(
    sliceRenderedLines(
      renderBytecode(deployed.originalHex, deployed.metadataSections),
      deployedWindow.start,
      deployedWindow.end,
    ),
  )
  const changes = diffLines(compiledDisassembly, deployedDisassembly)
  const lines = [formatDiffHeader(compiledWindow, deployedWindow)]

  for (const change of changes) {
    const prefix = change.added ? '+' : change.removed ? '-' : ' '
    const chunks = splitDiffChunk(change.value)
    for (const chunk of chunks) {
      if (chunk !== '') {
        lines.push(colorDiffLine(prefix, chunk))
      }
    }
  }

  return lines.join('\n')
}

function colorDiffLine(prefix: string, chunk: string): string {
  const line = `${prefix} ${chunk}`
  if (prefix === '+') {
    return chalk.green(line)
  }
  if (prefix === '-') {
    return chalk.red(line)
  }
  return chalk.dim(line)
}

function getDiffWindow(
  byteLength: number,
  diffOffset: number,
): { start: number; end: number } {
  return {
    start: Math.max(0, diffOffset - 16),
    end: Math.min(byteLength, diffOffset + 48),
  }
}

function formatDiffHeader(
  compiledWindow: { start: number; end: number },
  deployedWindow: { start: number; end: number },
): string {
  if (
    compiledWindow.start === deployedWindow.start &&
    compiledWindow.end === deployedWindow.end
  ) {
    return `disassembly diff (- compiled, + deployed) [bytes ${compiledWindow.start}..${compiledWindow.end})`
  }

  return `disassembly diff (- compiled, + deployed) [compiled bytes ${compiledWindow.start}..${compiledWindow.end}), [deployed bytes ${deployedWindow.start}..${deployedWindow.end})`
}

function renderBytecode(
  bytecodeHex: string,
  metadataSections: MetadataSection[],
): RenderedLine[] {
  const code = Buffer.from(bytecodeHex, 'hex')
  const rendered: RenderedLine[] = []
  let metadataIndex = 0
  let offset = 0

  while (offset < code.length) {
    const metadata = metadataSections[metadataIndex]
    if (metadata !== undefined && offset === metadata.start) {
      rendered.push({
        start: metadata.start,
        end: metadata.end,
        text: formatMetadataLine(metadata),
      })
      offset = metadata.end
      metadataIndex++
      continue
    }

    const segmentEnd = metadata?.start ?? code.length
    const instruction = disassembleInstruction(code, offset, segmentEnd)
    rendered.push({
      start: instruction.offset,
      end: instruction.offset + instruction.size,
      text: formatInstruction(instruction),
    })
    offset += instruction.size
  }

  return rendered
}

function disassembleInstruction(
  code: Buffer,
  offset: number,
  segmentEnd: number,
): Instruction {
  const opcode = code[offset]
  const mnemonic = opcodeToMnemonic(opcode)
  const instruction: Instruction = {
    offset,
    mnemonic,
    size: 1,
  }

  if (opcode < 0x60 || opcode > 0x7f) {
    return instruction
  }

  const pushLength = opcode - 0x5f
  const pushEnd = Math.min(offset + 1 + pushLength, segmentEnd)
  const pushData = code.subarray(offset + 1, pushEnd)
  instruction.pushData = `0x${pushData.toString('hex').padEnd(pushLength * 2, '0')}`
  instruction.size = pushEnd - offset
  return instruction
}

function opcodeToMnemonic(opcode: number): string {
  const mnemonic = OPCODES[opcode]
  if (mnemonic !== undefined) {
    return mnemonic
  }

  return `UNKNOWN(0x${opcode.toString(16).padStart(2, '0')})`
}

function formatMetadataLine(metadata: MetadataSection): string {
  const start = formatOffset(metadata.start)
  const end = formatOffset(metadata.end - 1)
  const fields = formatMetadataFields(metadata.metadata).join(' ')
  return `${start}..${end}: <solidity metadata ${fields}>`
}

function formatMetadataFields(metadata: SolidityMetadata): string[] {
  const fields: string[] = []

  if (metadata.ipfs !== undefined) {
    fields.push('ipfs')
  }

  if (metadata.bzzr0 !== undefined) {
    fields.push('bzzr0')
  }

  if (metadata.bzzr1 !== undefined) {
    fields.push('bzzr1')
  }

  if (metadata.experimental === true) {
    fields.push('experimental')
  }

  fields.push(`solc=${metadata.solc}`)
  return fields
}

function formatInstruction(instruction: Instruction): string {
  const offset = formatOffset(instruction.offset)
  const pushData = instruction.pushData ? ` ${instruction.pushData}` : ''
  return `${offset}: ${instruction.mnemonic}${pushData}`
}

function formatOffset(offset: number): string {
  return offset.toString(16).padStart(4, '0')
}

function formatRenderedLines(lines: RenderedLine[]): string {
  return lines.map((line) => line.text).join('\n')
}

function sliceRenderedLines(
  lines: RenderedLine[],
  windowStart: number,
  windowEnd: number,
): RenderedLine[] {
  return lines.filter((line) => line.start < windowEnd && line.end > windowStart)
}

function splitDiffChunk(chunk: string): string[] {
  if (chunk === '') {
    return []
  }

  return chunk.split('\n').filter((line) => line !== '')
}
