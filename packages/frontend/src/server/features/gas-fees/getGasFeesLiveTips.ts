import type {
  GasFeesTier,
  GasFeesTipsReading,
  GasFeesWallet,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { tipToUsd } from './types'

export interface GasFeesTip {
  key: GasFeesTier
  gwei: number
  /** On an ERC-20 transfer */
  usd: number
}

export interface GasFeesWalletTip {
  wallet: GasFeesWallet
  /** The wallet's own name for this option */
  option: string
  /** The tier it is shown beside. Wallets make their own promises, so this is not a match */
  beside: GasFeesTier
  gwei: number
}

export interface GasFeesLiveTips {
  block: number
  /** When the backend read the block */
  updatedAt: number
  /** Slow, medium, fast */
  tips: GasFeesTip[]
  /** As the backend last read them. It drops a wallet with no good read for 30 minutes */
  wallets: GasFeesWalletTip[]
}

const cache = new FrontendInMemoryCache('getGasFeesLiveTips')

/** The backend's newest estimate, or null when it has none yet. Pages poll this, so reads are shared for a few seconds */
export function getGasFeesLiveTips(): Promise<GasFeesLiveTips | null> {
  if (env.MOCK) return Promise.resolve(getMockLiveTips())
  return cache.get({ key: ['gas-fees', 'live-tips'], ttl: 3 }, async () => {
    const db = getDb()
    const [live, wallets] = await Promise.all([
      db.gasFeesLiveTips.find(),
      db.gasFeesWalletTip.getAll(),
    ])
    if (!live) return null
    return {
      block: live.blockNumber,
      updatedAt: live.updatedAt,
      tips: toTips(live),
      wallets: wallets.map((row) => ({
        wallet: row.wallet,
        option: row.option,
        beside: row.tier,
        gwei: row.tipGwei,
      })),
    }
  })
}

export function toTips(reading: GasFeesTipsReading): GasFeesTip[] {
  const tip = (key: GasFeesTier, gwei: number) => ({
    key,
    gwei,
    usd: tipToUsd(gwei, reading.ethUsd),
  })
  return [
    tip('slow', reading.slowTipGwei),
    tip('medium', reading.mediumTipGwei),
    tip('fast', reading.fastTipGwei),
  ]
}

function getMockLiveTips(): GasFeesLiveTips {
  const now = UnixTime.now()
  const fast = 0.08 + Math.random() * 0.04
  return {
    // One block every 12 seconds
    block: 21_000_000 + Math.floor(now / 12),
    updatedAt: now,
    tips: toTips({
      blockNumber: 0,
      slowTipGwei: 0.000003,
      mediumTipGwei: fast / 10,
      fastTipGwei: fast,
      ethUsd: 2_000,
    }),
    wallets: (['MetaMask', 'Rabby', 'Ambire'] as const).flatMap((wallet, i) =>
      (['slow', 'medium', 'fast'] as const).map((beside, j) => ({
        wallet,
        option: beside,
        beside,
        gwei: 0.5 * (i + 1) * (j + 1),
      })),
    ),
  }
}
