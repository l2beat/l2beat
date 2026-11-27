import { UnixTime } from '@l2beat/shared-pure'
import { GAS_FEES_CHAINS, type GasFeesChainId, gasTokenOf } from '../chains'
import { l1FeeInGas, operatorFee } from '../daily/feeRules'
import type { GasFeesDay } from '../daily/getGasFeesDays'
import { eachDay, utcDay } from '../days'
import { jitter, seededNoise } from './seededNoise'

interface MockChain {
  txs: number
  gasPerTx: number
  /** Gas token gwei */
  gasPrice: number
  priorityShare: number
  l1UsdPerTx: number
}

const CHAINS: Record<GasFeesChainId, MockChain> = {
  ethereum: {
    txs: 1.5e6,
    gasPerTx: 110e3,
    gasPrice: 0.6,
    priorityShare: 0.6,
    l1UsdPerTx: 0,
  },
  arbitrum: {
    txs: 2.5e6,
    gasPerTx: 400e3,
    gasPrice: 0.012,
    priorityShare: 0.05,
    l1UsdPerTx: 0.0012,
  },
  base: {
    txs: 10e6,
    gasPerTx: 150e3,
    gasPrice: 0.006,
    priorityShare: 0.75,
    l1UsdPerTx: 0.00008,
  },
  optimism: {
    txs: 1e6,
    gasPerTx: 120e3,
    gasPrice: 0.0005,
    priorityShare: 0.9,
    l1UsdPerTx: 0.00003,
  },
  zksync2: {
    txs: 0.3e6,
    gasPerTx: 300e3,
    gasPrice: 0.0045,
    priorityShare: 0,
    l1UsdPerTx: 0,
  },
  linea: {
    txs: 0.3e6,
    gasPerTx: 150e3,
    gasPrice: 0.05,
    priorityShare: 0.95,
    l1UsdPerTx: 0,
  },
  scroll: {
    txs: 0.1e6,
    gasPerTx: 150e3,
    gasPrice: 0.02,
    priorityShare: 0.2,
    l1UsdPerTx: 0.004,
  },
  unichain: {
    txs: 2e6,
    gasPerTx: 150e3,
    gasPrice: 0.002,
    priorityShare: 0.8,
    l1UsdPerTx: 0.00003,
  },
  ink: {
    txs: 1e6,
    gasPerTx: 150e3,
    gasPrice: 0.0005,
    priorityShare: 0.9,
    l1UsdPerTx: 0.00002,
  },
  abstract: {
    txs: 0.4e6,
    gasPerTx: 250e3,
    gasPrice: 0.0045,
    priorityShare: 0,
    l1UsdPerTx: 0,
  },
  taiko: {
    txs: 0.2e6,
    gasPerTx: 150e3,
    gasPrice: 0.02,
    priorityShare: 0.6,
    l1UsdPerTx: 0,
  },
  mantle: {
    txs: 0.1e6,
    gasPerTx: 150e3,
    gasPrice: 0.02,
    priorityShare: 0.6,
    l1UsdPerTx: 0.0001,
  },
}

const TAIKO_HALT = [utcDay('2026-06-23'), utcDay('2026-06-29')] as const
const MNT_USD = 0.8

export function mockEthUsd(timestamp: number): number {
  return 3000 + 800 * Math.sin(timestamp / (40 * UnixTime.DAY))
}

export function getMockGasFeesDays(from: UnixTime, to: UnixTime): GasFeesDay[] {
  const yesterday = UnixTime(
    UnixTime.toStartOf(UnixTime.now(), 'day') - UnixTime.DAY,
  )
  return eachDay(from, UnixTime(Math.min(to, yesterday))).flatMap((ts) =>
    GAS_FEES_CHAINS.flatMap((chain) =>
      // A few chain-days Dune never had whole
      chain !== 'ethereum' && seededNoise('missing', chain, ts) < 0.004
        ? []
        : [mockDay(chain, ts)],
    ),
  )
}

function mockDay(chain: GasFeesChainId, timestamp: UnixTime): GasFeesDay {
  if (
    chain === 'taiko' &&
    timestamp >= TAIKO_HALT[0] &&
    timestamp <= TAIKO_HALT[1]
  ) {
    return {
      timestamp,
      chain,
      txCount: 0,
      totalFeeNative: 0,
      totalFeeUsd: 0,
      l1FeeNative: 0,
      blobFeeNative: 0,
      baseFeeNative: 0,
      gasUsed: 0,
      medianFeeUsd: null,
    }
  }
  const c = CHAINS[chain]
  const ethUsd = mockEthUsd(timestamp)
  const tokenUsd = gasTokenOf(chain) === 'MNT' ? MNT_USD : ethUsd
  const txCount = Math.round(jitter(c.txs, 0.2, 'tx', chain, timestamp))
  const gasUsed = txCount * c.gasPerTx
  const busy = 0.4 + 2 * seededNoise('busy', chain, timestamp) ** 3
  const execution = gasUsed * c.gasPrice * busy * 1e-9
  const priority = execution * c.priorityShare
  const l1 =
    (txCount * jitter(c.l1UsdPerTx, 0.3, 'l1', chain, timestamp)) / tokenUsd
  const l1InGas = l1FeeInGas({ chain, timestamp })
  const blob = chain === 'ethereum' ? execution * 0.01 : 0
  const totalFeeNative =
    execution + blob + l1 + operatorFee({ chain, timestamp, gasUsed })
  const totalFeeUsd = totalFeeNative * tokenUsd
  return {
    timestamp,
    chain,
    txCount,
    totalFeeNative,
    totalFeeUsd,
    l1FeeNative: l1,
    blobFeeNative: blob,
    baseFeeNative: execution - priority + (l1InGas ? l1 : 0),
    gasUsed,
    medianFeeUsd: (totalFeeUsd / txCount) * 0.4,
  }
}
