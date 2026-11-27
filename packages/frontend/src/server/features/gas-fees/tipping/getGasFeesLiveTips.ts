import type { GasFeesTier, GasFeesWallet } from '@l2beat/database'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getMockLiveTips } from '../mock/mockTipping'

/** Every open card polls; one read serves them all for this long */
const SHARED_READ_MS = 3_000

export interface GasFeesLiveTips {
  estimate:
    | {
        blockNumber: number
        tips: Record<GasFeesTier, number>
        ethUsd: number
        updatedAt: number
      }
    | undefined
  wallets: { wallet: GasFeesWallet; tier: GasFeesTier; tipGwei: number }[]
}

let shared: { at: number; read: Promise<GasFeesLiveTips> } | undefined

export function getGasFeesLiveTips(): Promise<GasFeesLiveTips> {
  if (env.MOCK) return Promise.resolve(getMockLiveTips())
  const now = Date.now()
  if (!shared || now - shared.at > SHARED_READ_MS) {
    const read = readLiveTips()
    // A failed read must not be served to the next poll
    read.catch(() => {
      if (shared?.read === read) shared = undefined
    })
    shared = { at: now, read }
  }
  return shared.read
}

async function readLiveTips(): Promise<GasFeesLiveTips> {
  const db = getDb()
  const [live, wallets] = await Promise.all([
    db.gasFeesLiveTips.find(),
    db.gasFeesWalletTip.getAll(),
  ])
  return {
    estimate: live && {
      blockNumber: live.blockNumber,
      tips: {
        slow: live.slowTipGwei,
        medium: live.mediumTipGwei,
        fast: live.fastTipGwei,
      },
      ethUsd: live.ethUsd,
      updatedAt: live.updatedAt,
    },
    wallets: wallets.map(({ wallet, tier, tipGwei }) => ({
      wallet,
      tier,
      tipGwei,
    })),
  }
}
