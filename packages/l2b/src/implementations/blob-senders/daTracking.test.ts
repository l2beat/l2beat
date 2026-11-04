import { expect } from 'earl'
import { type EthereumDaTracking, matchDaTracking } from './daTracking'

const INBOX = '0x00000000000000000000000000000000000000aa'
const SEQUENCER = '0x00000000000000000000000000000000000000bb'
const OTHER = '0x00000000000000000000000000000000000000cc'
const TOPIC =
  '0x1111111111111111111111111111111111111111111111111111111111111111'

const config = (
  overrides: Partial<EthereumDaTracking>,
): EthereumDaTracking => ({
  projectId: 'project',
  inbox: INBOX,
  sequencers: [],
  topics: [],
  sinceBlock: 100,
  ...overrides,
})

const tx = (overrides: {
  from?: string
  to?: string
  blockNumber?: number
  topics?: string[]
}) => ({
  from: overrides.from ?? SEQUENCER,
  to: overrides.to ?? INBOX,
  blockNumber: overrides.blockNumber ?? 150,
  topics: new Set(overrides.topics ?? []),
})

describe(matchDaTracking.name, () => {
  it('matches on inbox when no sequencers are listed', () => {
    expect(matchDaTracking(tx({ from: OTHER }), [config({})])).toEqual([
      'project',
    ])
  })

  it('requires a listed sequencer when sequencers are set', () => {
    const configs = [config({ sequencers: [SEQUENCER] })]
    expect(matchDaTracking(tx({}), configs)).toEqual(['project'])
    expect(matchDaTracking(tx({ from: OTHER }), configs)).toEqual([])
  })

  it('matches a topic regardless of inbox and sender', () => {
    const configs = [config({ inbox: OTHER, topics: [TOPIC] })]
    expect(
      matchDaTracking(tx({ to: SEQUENCER, topics: [TOPIC] }), configs),
    ).toEqual(['project'])
    expect(matchDaTracking(tx({ to: SEQUENCER }), configs)).toEqual([])
  })

  it('treats both ends of the range as inclusive', () => {
    const configs = [config({ sinceBlock: 100, untilBlock: 200 })]
    expect(matchDaTracking(tx({ blockNumber: 99 }), configs)).toEqual([])
    expect(matchDaTracking(tx({ blockNumber: 100 }), configs)).toEqual([
      'project',
    ])
    expect(matchDaTracking(tx({ blockNumber: 200 }), configs)).toEqual([
      'project',
    ])
    expect(matchDaTracking(tx({ blockNumber: 201 }), configs)).toEqual([])
  })
})
