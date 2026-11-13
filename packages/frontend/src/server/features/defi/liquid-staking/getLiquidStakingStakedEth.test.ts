import type {
  LiquidStakingSnapshotRecord,
  TokenValueRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { computeStakedEth } from './getLiquidStakingStakedEth'

const DAY = UnixTime.toStartOf(UnixTime(1_762_646_400), 'day')
const ETH = 10n ** 18n

describe(computeStakedEth.name, () => {
  it('counts rebasing tokens one ETH each and appreciating ones at their rate', () => {
    const result = computeStakedEth({
      projects: [
        { id: 'lido', type: 'lido', tokenIds: ['lido-stETH'] },
        { id: 'rocketpool', type: 'rocketpool', tokenIds: ['rocketpool-rETH'] },
      ],
      day: DAY,
      tokenValues: [
        tokenValue('lido', 'lido-stETH', DAY, 9_000_000),
        tokenValue('rocketpool', 'rocketpool-rETH', DAY, 300_000),
      ],
      snapshots: [
        // wstETH's rate, which stETH supply must not be multiplied by
        snapshot('lido', DAY, (122n * ETH) / 100n),
        snapshot('rocketpool', DAY, (115n * ETH) / 100n),
      ],
    })

    expect(result.get('lido')).toEqual(9_000_000)
    expect(result.get('rocketpool') ?? Number.NaN).toBeCloseTo(345_000, 1e-6)
  })

  it('leaves a project out without its rate, or with a stale or missing supply', () => {
    const result = computeStakedEth({
      projects: [
        { id: 'cbeth', type: 'cbeth', tokenIds: ['cbeth-cbETH'] },
        { id: 'wbeth', type: 'wbeth', tokenIds: ['wbeth-wBETH'] },
        { id: 'etherfi', type: 'etherfi', tokenIds: ['etherfi-eETH'] },
      ],
      day: DAY,
      tokenValues: [
        tokenValue('cbeth', 'cbeth-cbETH', DAY, 100),
        tokenValue('wbeth', 'wbeth-wBETH', DAY - 2 * UnixTime.DAY, 100),
      ],
      snapshots: [snapshot('wbeth', DAY, ETH)],
    })

    expect([...result.keys()]).toEqual([])
  })
})

function tokenValue(
  projectId: string,
  tokenId: string,
  timestamp: UnixTime,
  amount: number,
): TokenValueRecord {
  return {
    timestamp,
    configurationId: tokenId,
    projectId,
    tokenId,
    amount,
    value: 0,
    valueForProject: 0,
    valueForSummary: 0,
    priceUsd: 0,
  }
}

function snapshot(
  projectId: string,
  timestamp: UnixTime,
  exchangeRate: bigint,
): LiquidStakingSnapshotRecord {
  return {
    configurationId: projectId,
    projectId,
    timestamp,
    blockNumber: 0,
    exchangeRate,
    lastRequestId: null,
    lastFinalizedRequestId: null,
    instantExitEth: null,
    instantExitFeeBps: null,
    lockTime: null,
    marketExitEth: null,
    marketExitValueEth: null,
  }
}
