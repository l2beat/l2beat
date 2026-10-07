import type { Log } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  computeLogsBloom,
  EMPTY_LOGS_BLOOM,
  mergeLogsBlooms,
} from './logsBloom'

// Avalanche C-Chain block 95921096, the last minutes before Helicon, so its
// header bloom still describes its own three logs.
const BLOCK_95921096_LOGS_BLOOM =
  '0x00008000000000000000000000100000000100000000000020000000000000000000000000000000004000000000000000009000010000000000000000000000000080000000000000000008000000000000000000000000200200000000000000000000020000000000000000001900000000000000000000000010000000000000000000000000000000000000000040000000000000002000000000400000000000040000000000000000000000000000000000000000000000000000000000000002000000000000040000001000000000000000000000000400000020000000000000000000000000000000000000000000000000400000000000000000'
const BLOCK_95921096_LOGS: Log[] = [
  log('0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x00000000000000000000000011430da767ffcde06da1a97d54224db34fdb2103',
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ]),
  log('0xfa4edd04eaacdb07c8d73621bc1790ec50d8c489', [
    '0xdd84a3fa9ef9409f550d54d6affec7e9c480c878c6ab27b78912a03e1b371c6e',
    '0x0000000000000000000000000000000000000000000000001ab1ae3f9229c5ff',
  ]),
  log('0xf0f791901854fab16adebd60f0639b960b6ea0cf', [
    '0xb04e63db38c49950639fa09d29872f21f5d49d614f3a969d8adf3d4b52e41a62',
  ]),
]

describe(computeLogsBloom.name, () => {
  it('matches the header bloom of a real block', () => {
    expect(computeLogsBloom(BLOCK_95921096_LOGS)).toEqual(
      BLOCK_95921096_LOGS_BLOOM,
    )
  })

  it('is empty without logs', () => {
    expect(computeLogsBloom([])).toEqual(EMPTY_LOGS_BLOOM)
  })
})

describe(mergeLogsBlooms.name, () => {
  it('equals the bloom of the combined logs', () => {
    const [a, b, c] = BLOCK_95921096_LOGS

    const merged = mergeLogsBlooms([
      computeLogsBloom([a]),
      computeLogsBloom([b, c]),
    ])

    expect(merged).toEqual(BLOCK_95921096_LOGS_BLOOM)
  })

  it('is empty without blooms', () => {
    expect(mergeLogsBlooms([])).toEqual(EMPTY_LOGS_BLOOM)
  })
})

function log(address: string, topics: string[]): Log {
  return {
    address,
    topics,
    data: '0x',
    blockNumber: 95921096,
    blockHash:
      '0x8ac9c829b9e0d0c2cdf6afd7282f37c74e5bbde4f87f2acbbd13396867a77274',
    transactionHash: '0x',
    logIndex: 0,
  }
}
