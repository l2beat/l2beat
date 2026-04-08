import assert from 'node:assert/strict'
import test from 'node:test'
import { compareBytecodes, stripMetadata } from './compareBytecode'

const ipfsMetadataA =
  'a264697066735822122082356359b9e035fa182c6439366282fd44ff9343bd3650b264b3ffc6a8ee79f364736f6c634300080f0033'
const ipfsMetadataB =
  'a264697066735822122092356359b9e035fa182c6439366282fd44ff9343bd3650b264b3ffc6a8ee79f364736f6c634300080f0033'

test('stripMetadata removes short solidity metadata trailer', () => {
  const runtime = '60006000fdfe'
  const metadata = 'a164736f6c634300080f000a'

  assert.equal(stripMetadata(runtime + metadata), runtime)
})

test('stripMetadata removes duplicated solidity metadata trailers', () => {
  const runtime = '60006000fdfe'
  const metadata = 'a164736f6c634300080f000a'

  assert.equal(stripMetadata(runtime + metadata + metadata), runtime)
})

test('stripMetadata removes ipfs solidity metadata trailer', () => {
  const runtime = '60006000fdfe'
  const metadata =
    'a264697066735822122082356359b9e035fa182c6439366282fd44ff9343bd3650b264b3ffc6a8ee79f364736f6c634300080f0033'

  assert.equal(stripMetadata(runtime + metadata), runtime)
})

test('stripMetadata ignores non-metadata tails', () => {
  const bytecode = '60006000fdfe000a'

  assert.equal(stripMetadata(bytecode), bytecode)
})

test('stripMetadata removes inline solidity metadata sections', () => {
  const bytecode = `0x6001${ipfsMetadataA}6002`

  assert.equal(stripMetadata(bytecode), '60016002')
})

test('compareBytecodes ignores differing inline metadata sections', () => {
  const result = compareBytecodes(`6001${ipfsMetadataA}6002`, `6001${ipfsMetadataB}6002`, {})

  assert.deepEqual(result, { status: 'match' })
})

test('compareBytecodes reports disassembly diff for mismatched bytecode', () => {
  const result = compareBytecodes('6001600055', '6002600055', {})

  assert.deepEqual(result, {
    status: 'mismatch',
    detail: [
      '1 byte(s) differ, first at offset 1',
      'disassembly diff (- compiled, + deployed) [bytes 0..5)',
      '- 0000: PUSH1 0x01',
      '+ 0000: PUSH1 0x02',
      '  0002: PUSH1 0x00',
      '  0004: SSTORE',
    ].join('\n'),
  })
})

test('compareBytecodes pads truncated push data in disassembly diff', () => {
  const result = compareBytecodes('61', '62', {})

  assert.deepEqual(result, {
    status: 'mismatch',
    detail: [
      '1 byte(s) differ, first at offset 0',
      'disassembly diff (- compiled, + deployed) [bytes 0..1)',
      '- 0000: PUSH2 0x0000',
      '+ 0000: PUSH3 0x000000',
    ].join('\n'),
  })
})

test('compareBytecodes limits disassembly diff to nearby instructions', () => {
  const result = compareBytecodes(
    '6001600260036004600555600660076008600955',
    '6001600260036004600655600660076008600955',
    {},
  )

  assert.deepEqual(result, {
    status: 'mismatch',
    detail: [
      '1 byte(s) differ, first at offset 9',
      'disassembly diff (- compiled, + deployed) [bytes 0..20)',
      '  0000: PUSH1 0x01',
      '  0002: PUSH1 0x02',
      '  0004: PUSH1 0x03',
      '  0006: PUSH1 0x04',
      '- 0008: PUSH1 0x05',
      '+ 0008: PUSH1 0x06',
      '  000a: SSTORE',
      '  000b: PUSH1 0x06',
      '  000d: PUSH1 0x07',
      '  000f: PUSH1 0x08',
      '  0011: PUSH1 0x09',
      '  0013: SSTORE',
    ].join('\n'),
  })
})

test('compareBytecodes includes push instruction overlapping the diff window', () => {
  const prefix = '00'.repeat(225)
  const compiled = `${prefix}61010200`
  const deployed = `${prefix}61020200`

  const result = compareBytecodes(compiled, deployed, {})

  assert.deepEqual(result, {
    status: 'mismatch',
    detail: [
      '1 byte(s) differ, first at offset 226',
      'disassembly diff (- compiled, + deployed) [bytes 210..229)',
      '  00d2: STOP',
      '  00d3: STOP',
      '  00d4: STOP',
      '  00d5: STOP',
      '  00d6: STOP',
      '  00d7: STOP',
      '  00d8: STOP',
      '  00d9: STOP',
      '  00da: STOP',
      '  00db: STOP',
      '  00dc: STOP',
      '  00dd: STOP',
      '  00de: STOP',
      '  00df: STOP',
      '  00e0: STOP',
      '- 00e1: PUSH2 0x0102',
      '+ 00e1: PUSH2 0x0202',
      '  00e4: STOP',
    ].join('\n'),
  })
})

test('compareBytecodes labels metadata sections in disassembly diff', () => {
  const result = compareBytecodes(`6001${ipfsMetadataA}6002`, `6001${ipfsMetadataB}6003`, {})

  assert.deepEqual(result, {
    status: 'mismatch',
    detail: [
      'after ignoring Solidity metadata, 1 byte(s) differ, first at offset 56',
      'disassembly diff (- compiled, + deployed) [bytes 40..57)',
      '  0002..0036: <solidity metadata ipfs solc=0.8.15>',
      '- 0037: PUSH1 0x02',
      '+ 0037: PUSH1 0x03',
    ].join('\n'),
  })
})
