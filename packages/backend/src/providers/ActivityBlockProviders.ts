import type { AztecBlockProvider, BlockProvider } from '@l2beat/shared'
import { assert, type Block } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type {
  ActivityBlock,
  ActivityBlockProvider,
} from '../modules/activity/services/txs/types'
import type { UopsAnalyzer } from '../modules/activity/services/uops/types'
import type { BlockProcessor } from '../modules/types'
import { ActivityBlockCache } from './ActivityBlockCache'
import type { AztecBlockProviders } from './AztecBlockProviders'
import type { BlockProviders } from './BlockProviders'
import type { UopsAnalyzers } from './UopsAnalyzers'

export class ActivityBlockProviders {
  private readonly providers = new Map<string, ActivityBlockProvider>()

  constructor(
    blockProviders: BlockProviders,
    aztecBlockProviders: AztecBlockProviders,
    uopsAnalyzers: UopsAnalyzers,
  ) {
    for (const provider of blockProviders.getAll()) {
      this.add(
        new StandardActivityBlockProvider(
          provider,
          uopsAnalyzers.getUopsAnalyzer(provider.chain),
        ),
      )
    }
    for (const provider of aztecBlockProviders.getAll()) {
      this.add(new AztecActivityBlockProvider(provider))
    }
  }

  getProvider(chain: string): ActivityBlockProvider {
    const provider = this.providers.get(chain)
    assert(provider, `ActivityBlockProvider not found: ${chain}`)
    return provider
  }

  private add(provider: ActivityBlockProvider): void {
    assert(
      !this.providers.has(provider.chain),
      `ActivityBlockProvider already exists: ${provider.chain}`,
    )
    this.providers.set(provider.chain, provider)
  }
}

export class StandardActivityBlockProvider implements ActivityBlockProvider {
  private readonly cache = new ActivityBlockCache()
  /** Blocks that block sync already fetched are summarized here instead of being fetched again */
  readonly blockObserver: BlockProcessor

  constructor(
    private readonly provider: BlockProvider,
    private readonly uopsAnalyzer: UopsAnalyzer | undefined,
  ) {
    this.blockObserver = {
      chain: provider.chain,
      processBlock: (block) => {
        this.cache.set(this.toActivityBlock(block))
        return Promise.resolve()
      },
    }
  }

  get chain(): string {
    return this.provider.chain
  }

  async getBlocks(from: number, to: number): Promise<ActivityBlock[]> {
    return await Promise.all(
      range(from, to + 1).map(
        async (number) =>
          this.cache.get(number) ??
          this.toActivityBlock(
            await this.provider.getBlockWithTransactions(number),
          ),
      ),
    )
  }

  private toActivityBlock(block: Block): ActivityBlock {
    return {
      number: block.number,
      timestamp: block.timestamp,
      txsCount: block.transactions.length,
      uopsCount: this.uopsAnalyzer?.calculateUops(block) ?? null,
    }
  }
}

export class AztecActivityBlockProvider implements ActivityBlockProvider {
  constructor(private readonly provider: AztecBlockProvider) {}

  get chain(): string {
    return this.provider.chain
  }

  async getBlocks(from: number, to: number): Promise<ActivityBlock[]> {
    const blocks = await this.provider.getBlocks(from, to - from + 1)
    return blocks.map((block) => ({
      number: block.number,
      timestamp: block.timestamp,
      txsCount: block.txEffectsCount,
      uopsCount: null,
    }))
  }
}
