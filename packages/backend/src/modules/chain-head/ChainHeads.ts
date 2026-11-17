import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { IRpcClient } from '@l2beat/shared'
import { ChainHeadIndexer } from './ChainHeadIndexer'
import { RpcHeadSource } from './RpcHeadSource'

/**
 * The chain heads of this process, one per chain however many modules read
 * it. Modules ask for theirs while they are created; the chain head module
 * starts them all once every module has
 */
export class ChainHeads {
  private readonly heads = new Map<string, ChainHeadIndexer>()

  constructor(
    private readonly $: {
      rpcClients: IRpcClient[]
      db: Database
      logger: Logger
    },
  ) {}

  /**
   * Undefined for a chain with no RPC to follow. The head keeps its blocks
   * for as long as the reader that looks furthest back asks. The batch size
   * of whoever asks first holds for the chain
   */
  get(
    chain: string,
    reader: { batchSize: number; keepFor: number },
  ): ChainHeadIndexer | undefined {
    const existing = this.heads.get(chain)
    if (existing) {
      existing.keepAtLeast(reader.keepFor)
      return existing
    }

    const rpc = this.$.rpcClients.find((client) => client.chain === chain)
    if (!rpc) return undefined

    const head = new ChainHeadIndexer(
      {
        chain,
        source: new RpcHeadSource(rpc),
        db: this.$.db,
        batchSize: reader.batchSize,
        keepFor: reader.keepFor,
      },
      this.$.logger.tag({ feature: 'chainHead', module: 'chainHead' }),
    )
    this.heads.set(chain, head)
    return head
  }

  all(): ChainHeadIndexer[] {
    return [...this.heads.values()]
  }
}
