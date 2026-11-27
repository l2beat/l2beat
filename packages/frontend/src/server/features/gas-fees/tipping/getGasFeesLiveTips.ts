import type { GasFeesTier, GasFeesWallet } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { tipToUsd } from '../chains'
import { getMockLiveTips } from '../mock/mockTipping'

/** Every open card polls; one read serves them all for this long */
const SHARED_READ_SECONDS = 3
/** The backend deletes a wallet's tips after this long without a good read; if it stops, so do we */
const WALLET_KEEP_SECONDS = 30 * 60

const cache = new FrontendInMemoryCache('getGasFeesLiveTips')

export interface GasFeesLiveTips {
  /** The server's clock at the read, to age the estimate by: a device's may be off */
  readAt: number
  estimate:
    | {
        blockNumber: number
        tips: Record<GasFeesTier, number>
        /** What a gwei of tip adds to an ERC-20 transfer, USD */
        usdPerGwei: number
        updatedAt: number
      }
    | undefined
  wallets: { wallet: GasFeesWallet; tier: GasFeesTier; tipGwei: number }[]
}

export function getGasFeesLiveTips(): Promise<GasFeesLiveTips> {
  if (env.MOCK) return Promise.resolve(getMockLiveTips())
  return cache.get(
    { key: ['gas-fees-live-tips'], ttl: SHARED_READ_SECONDS },
    readLiveTips,
  )
}

async function readLiveTips(): Promise<GasFeesLiveTips> {
  const db = getDb()
  const [live, wallets] = await Promise.all([
    db.gasFeesLiveTips.find(),
    db.gasFeesWalletTip.getAll(),
  ])
  const readAt = UnixTime.now()
  return {
    readAt,
    estimate: live && {
      blockNumber: live.blockNumber,
      tips: {
        slow: live.slowTipGwei,
        medium: live.mediumTipGwei,
        fast: live.fastTipGwei,
      },
      usdPerGwei: tipToUsd(1, live.ethUsd),
      updatedAt: live.updatedAt,
    },
    wallets: wallets
      .filter((w) => readAt - w.readAt <= WALLET_KEEP_SECONDS)
      .map(({ wallet, tier, tipGwei }) => ({ wallet, tier, tipGwei })),
  }
}
