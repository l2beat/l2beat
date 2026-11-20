import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getLiveChainStatus,
  type LiveChainState,
  type LiveStatus,
} from './getLiveChainStatus'

/**
 * Methodology: the chain makes a block a second. The feature read up to
 * block 160, made ten seconds ago, and the head's source confirmed that block
 * as the newest five seconds ago
 */
const START = UnixTime.fromDate(new Date('2026-11-19T10:00:00Z'))
const NOW = START + 170

describe(getLiveChainStatus.name, () => {
  it('is live as of the newest block read', () => {
    expect(getLiveChainStatus(state(), NOW)).toEqual({
      status: 'live',
      asOf: START + 160,
    })
  })

  const notShown: [string, Partial<LiveChainState>, LiveStatus][] = [
    ['nothing is stored at the head', { cursor: undefined }, 'off'],
    ['an hour was sealed differently', { mismatched: true }, 'held back'],
    [
      'the newest sealed hours were not matched',
      { matched: false },
      'unchecked',
    ],
    [
      'the head no longer has the block read up to',
      { onHead: false },
      'incomplete',
    ],
  ]
  for (const [name, overrides, status] of notShown) {
    it(`is ${status} when ${name}`, () => {
      expect(getLiveChainStatus(state(overrides), NOW)).toEqual({
        status,
        asOf: undefined,
      })
    })
  }

  it('is held back by a mismatch even when the newest hours matched', () => {
    const result = getLiveChainStatus(
      state({ matched: true, mismatched: true }),
      NOW,
    )

    expect(result.status).toEqual('held back')
  })

  it('is delayed once the source was not heard from for over a minute', () => {
    expect(getLiveChainStatus(state(), START + 165 + 61)).toEqual({
      status: 'delayed',
      asOf: START + 160,
    })
  })

  it('is delayed when the source keeps confirming a block far older than the chain takes to make the next', () => {
    // as a source does that is itself stuck behind the chain
    const result = getLiveChainStatus(state({ heardAt: NOW + 300 }), NOW + 300)

    expect(result).toEqual({ status: 'delayed', asOf: START + 160 })
  })

  it('stays live through a gap a chain with slow blocks usually has', () => {
    const result = getLiveChainStatus(
      state({ blockGap: 120, heardAt: NOW + 300 }),
      NOW + 300,
    )

    expect(result).toEqual({ status: 'live', asOf: START + 160 })
  })
})

function state(overrides: Partial<LiveChainState> = {}): LiveChainState {
  return {
    cursor: {
      indexerId: 'reader::ethereum',
      chain: 'ethereum',
      sinceNumber: 90,
      sinceTimestamp: START + 90,
      startedAt: START + 90,
      number: 160,
      hash: '0x160',
      timestamp: START + 160,
    },
    onHead: true,
    heardAt: START + 165,
    blockGap: 1,
    matched: true,
    mismatched: false,
    ...overrides,
  }
}
