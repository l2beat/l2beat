import { expect } from 'earl'
import type { Log } from 'viem'
import { createEventParser } from './types'

describe(createEventParser.name, () => {
  const parseTransfer = createEventParser(
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  )

  it('ignores EIP-7708 ETH transfer logs', () => {
    expect(parseTransfer(ETH_TRANSFER_LOG, null)).toEqual(undefined)
  })

  it('parses the same Transfer emitted by a token', () => {
    const tokenLog = {
      ...ETH_TRANSFER_LOG,
      address: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
    } as Log

    expect(parseTransfer(tokenLog, null)).toEqual({
      from: '0x49d3e7F41fA7750c9596E1De59692862ccb104b1',
      to: '0x34B058ca40aA6E7b6B069FdB3D4C76165edC4a82',
      value: 50000000000000000n,
    })
  })
})

// Sepolia tx 0xc82f158807dccb9ad0dddaec2c32a7dc4a7588aa147fc02f01e7d5eeeb12e377,
// a plain 0.05 ETH transfer after Glamsterdam.
const ETH_TRANSFER_LOG = {
  address: '0xfffffffffffffffffffffffffffffffffffffffe',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x00000000000000000000000049d3e7f41fa7750c9596e1de59692862ccb104b1',
    '0x00000000000000000000000034b058ca40aa6e7b6b069fdb3d4c76165edc4a82',
  ],
  data: '0x00000000000000000000000000000000000000000000000000b1a2bc2ec50000',
  logIndex: 0x48,
} as unknown as Log
