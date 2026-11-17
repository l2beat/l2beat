import type { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesWallet } from '@l2beat/database'
import type { IRpcClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../tools/TimeLoop'
import { type FetchText, fetchText } from '../fetchText'
import {
  AMBIRE_BLOCKS,
  AMBIRE_PERCENTILES,
  computeAmbire,
  METAMASK_FEES,
  parseMetaMask,
  parseRabby,
  RABBY_FEES,
  type WalletTip,
} from './wallets'

/** Wallet suggestions sit beside ours for comparison, so minutes old is fine, and fee services rate limit */
export const WALLET_INTERVAL_MS = 5 * 60_000
/** A wallet with no good read for this long is deleted */
const WALLET_KEEP_SECONDS = 30 * 60
/** A fee service that answers 429 is not asked again for this long */
const WALLET_BACKOFF_SECONDS = 30 * 60

export type WalletRpc = Pick<
  IRpcClient,
  'getLatestBlockNumber' | 'getFeeHistory' | 'getMaxPriorityFeePerGas'
>

interface WalletSource {
  wallet: GasFeesWallet
  read: () => Promise<WalletTip[]>
}

export class WalletTipsLoop extends TimeLoop {
  private readonly sources: WalletSource[]
  /** When each wallet may be asked again after a 429 */
  private readonly retryAt = new Map<GasFeesWallet, UnixTime>()

  constructor(
    private readonly $: {
      db: Database
      rpc: WalletRpc
      /** Whether to poll MetaMask's and Rabby's fee services */
      walletServices: boolean
      fetchText?: FetchText
    },
    protected logger: Logger,
  ) {
    super({ intervalMs: WALLET_INTERVAL_MS })
    this.logger = logger.for(this)
    this.sources = [
      ...($.walletServices
        ? [
            {
              wallet: 'MetaMask' as const,
              read: () => this.readService(METAMASK_FEES, parseMetaMask),
            },
            {
              wallet: 'Rabby' as const,
              read: () => this.readService(RABBY_FEES, parseRabby),
            },
          ]
        : []),
      { wallet: 'Ambire', read: () => this.computeAmbire() },
    ]
  }

  async run(): Promise<void> {
    const now = UnixTime.now()
    const reads = await Promise.all(
      this.sources.map((source) => this.readWallet(source, now)),
    )
    await this.$.db.gasFeesWalletTip.upsertMany(
      reads.flat().map((tip) => ({ ...tip, readAt: now })),
    )
    await this.$.db.gasFeesWalletTip.deleteReadBefore(
      UnixTime(now - WALLET_KEEP_SECONDS),
    )
  }

  /** A failed read stores nothing, so the last good one stays until it's too old */
  private async readWallet(
    source: WalletSource,
    now: UnixTime,
  ): Promise<WalletTip[]> {
    if (now < (this.retryAt.get(source.wallet) ?? 0)) return []
    try {
      return await source.read()
    } catch (error) {
      if (error instanceof RateLimited) {
        this.retryAt.set(source.wallet, UnixTime(now + WALLET_BACKOFF_SECONDS))
        this.logger.warn('Wallet fee service rate limited', {
          wallet: source.wallet,
        })
      } else {
        this.logger.error('Wallet tips read failed', {
          wallet: source.wallet,
          error,
        })
      }
      return []
    }
  }

  private async readService(
    url: string,
    parse: (json: unknown) => WalletTip[],
  ): Promise<WalletTip[]> {
    const { status, text } = await (this.$.fetchText ?? fetchText)(url)
    if (status === 429) throw new RateLimited()
    if (status !== 200) {
      throw new Error('Wallet fee service error', { cause: { url, status } })
    }
    return parse(JSON.parse(text))
  }

  private async computeAmbire(): Promise<WalletTip[]> {
    const head = await this.$.rpc.getLatestBlockNumber()
    const [history, nodeTip] = await Promise.all([
      this.$.rpc.getFeeHistory(AMBIRE_BLOCKS, head, AMBIRE_PERCENTILES),
      this.$.rpc.getMaxPriorityFeePerGas(),
    ])
    const rewards = (history.reward ?? []).map((row) =>
      row.map((wei) => Number(wei) / 1e9),
    )
    return computeAmbire(rewards, Number(nodeTip) / 1e9)
  }
}

class RateLimited extends Error {
  constructor() {
    super('Wallet fee service rate limited')
  }
}
