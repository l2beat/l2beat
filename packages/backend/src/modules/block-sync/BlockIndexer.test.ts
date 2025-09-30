import type { Block, Log } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { onlyConsistent } from './BlockIndexer'

describe(onlyConsistent.name, () => {
  const EMPTY_LOGS_BLOOM = `0x${'0'.repeat(512)}`
  const FULL_LOGS_BLOOM = `0x${'1'.repeat(512)}`

  it('handles the case where everything works', () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    const block3 = { hash: '0x3', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log
    const logB = { data: '0xb', blockHash: '0x3' } as Log
    const logC = { data: '0xc', blockHash: '0x3' } as Log

    const result = onlyConsistent([block1, block2, block3], [logA, logB, logC])
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
      { block: block3, logs: [logB, logC] },
    ])
  })

  it('handles a reorg', () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    // This hash is reorged from 0x3 to 0x4
    const block3 = { hash: '0x4', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log
    const logB = { data: '0xb', blockHash: '0x3' } as Log
    const logC = { data: '0xc', blockHash: '0x3' } as Log

    const result = onlyConsistent([block1, block2, block3], [logA, logB, logC])
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
    ])
  })

  it('handles missing logs', () => {
    const block1 = { hash: '0x1', logsBloom: FULL_LOGS_BLOOM } as Block
    const block2 = { hash: '0x2', logsBloom: EMPTY_LOGS_BLOOM } as Block
    const block3 = { hash: '0x3', logsBloom: FULL_LOGS_BLOOM } as Block

    const logA = { data: '0xa', blockHash: '0x1' } as Log

    const result = onlyConsistent([block1, block2, block3], [logA])
    expect(result).toEqual([
      { block: block1, logs: [logA] },
      { block: block2, logs: [] },
    ])
  })
})
