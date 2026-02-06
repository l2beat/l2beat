import type { Logger } from '@l2beat/backend-tools'
import type {
  AbstractTokenRecord,
  Database,
  InteropMessageRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  generateId,
  type InteropApproximateQuery,
  type InteropEvent,
  type InteropEventDb,
  type InteropEventQuery,
  type InteropEventType,
  type InteropMatchContext,
  type InteropMessage,
  type InteropPlugin,
  type InteropTransfer,
  type MatchResult,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import type { InteropTransferStream } from '../stream/InteropTransferStream'

const EMPTY_MATCH_CONTEXT: InteropMatchContext = {
  getAbstractToken: (_deployedToken) => undefined,
}

export class InteropMatchingLoop extends TimeLoop {
  constructor(
    private store: InteropEventStore,
    private db: Database,
    private tokenDbClient: TokenDbClient,
    private plugins: InteropPlugin[],
    private supportedChains: string[],
    protected logger: Logger,
    private transferStream: InteropTransferStream,
    private readonly intervalMs = 10_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const matchContext = await this.buildMatchContext()
    const result = await match(
      this.store,
      (type) => this.store.getEvents(type),
      this.store.getEventTypes(),
      this.store.getEventCount(),
      this.plugins,
      this.supportedChains,
      this.logger,
      matchContext,
    )

    const messageRecords = result.messages.map(toMessageRecord)
    const transferRecords = result.transfers.map(toTransferRecord)

    await this.db.transaction(async () => {
      if (result.matched.length > 0 || result.unsupported.length > 0) {
        await this.store.updateMatchedAndUnsupported({
          matched: result.matched,
          unsupported: result.unsupported,
        })
      }
      const messages = await this.db.interopMessage.insertMany(messageRecords)
      const transfers =
        await this.db.interopTransfer.insertMany(transferRecords)

      this.logger.info('Matching results saved', {
        messages,
        transfers,
      })
    })

    if (transferRecords.length > 0) {
      this.transferStream?.publishBulk(transferRecords, this.intervalMs)
    }
  }

  private async buildMatchContext(): Promise<InteropMatchContext> {
    try {
      const { abstractTokens } =
        await this.tokenDbClient.abstractTokens.getAllWithDeployedTokens.query()
      return {
        getAbstractToken: createAbstractTokenLookup(abstractTokens),
      }
    } catch (error) {
      throw new Error('Token DB unavailable for matching', { cause: error })
    }
  }
}

export async function match(
  db: InteropEventDb,
  getEvents: (type: string) => InteropEvent[],
  eventTypes: string[],
  count: number,
  plugins: InteropPlugin[],
  supportedChains: string[],
  logger: Logger,
  matchContext: InteropMatchContext = EMPTY_MATCH_CONTEXT,
) {
  const start = Date.now()
  logger.info('Matching started', {
    plugins: plugins.length,
    events: count,
    chains: supportedChains.length,
  })

  const matched = new Set<InteropEvent>()
  const unsupported = new Set<InteropEvent>()
  const allMessages: InteropMessage[] = []
  const allTransfers: InteropTransfer[] = []
  const isExcluded = (event: InteropEvent) =>
    matched.has(event) || unsupported.has(event)
  const filteredDb = createFilteredDb(db, isExcluded)

  for (const plugin of plugins) {
    if (!plugin.matchTypes || !plugin.match) {
      continue
    }

    await new Promise((r) => setTimeout(r)) // Unblock event loop
    const start = Date.now()
    const stats = {
      events: 0,
      matchedEvents: 0,
      messages: 0,
      transfers: 0,
    }

    for (const type of plugin.matchTypes) {
      const events = getEvents(type.type)
      stats.events += events.length
      for (const event of events) {
        if (matched.has(event) || unsupported.has(event)) {
          continue
        }
        let result: MatchResult | undefined
        try {
          result = await plugin.match?.(event, filteredDb, matchContext)
        } catch (e) {
          logger.error('Matching failed', e, {
            plugin: plugin.name,
            eventId: event.eventId,
            eventType: event.type,
            eventTxHash: event.ctx.txHash,
          })
        }
        if (!result) {
          continue
        }

        matched.add(event)
        for (const item of result) {
          if (item.kind === 'InteropMessage') {
            allMessages.push({ ...item, plugin: plugin.name })
            stats.messages++
            stats.matchedEvents += item.events.length
            for (const event of item.events) {
              matched.add(event)
            }
          } else if (item.kind === 'InteropTransfer') {
            allTransfers.push({ ...item, plugin: plugin.name })
            stats.transfers++
            stats.matchedEvents += item.events.length
            for (const event of item.events) {
              matched.add(event)
            }
          } else if (item.kind === 'InteropIgnore') {
            for (const event of item.events) {
              unsupported.add(event)
            }
          }
        }
      }
    }

    logger.info('Plugin executed', {
      name: plugin.name,
      duration: Date.now() - start,
      events: stats.events,
      matchedEvents: stats.matchedEvents,
      messages: stats.messages,
      transfers: stats.transfers,
    })
  }

  for (const type of eventTypes) {
    for (const event of getEvents(type)) {
      if (matched.has(event)) {
        continue
      }
      const $srcChain = (event.args as Record<string, unknown>).$srcChain
      if (
        typeof $srcChain === 'string' &&
        !supportedChains.includes($srcChain)
      ) {
        unsupported.add(event)
      }
      const $dstChain = (event.args as Record<string, unknown>).$dstChain
      if (
        typeof $dstChain === 'string' &&
        !supportedChains.includes($dstChain)
      ) {
        unsupported.add(event)
      }
    }
  }

  logger.info('Matching finished', {
    duration: Date.now() - start,
    plugins: plugins.length,
    events: count,
    chains: supportedChains.length,
    matchedEvents: matched.size,
    unsupportedEvents: unsupported.size,
    messages: allMessages.length,
    transfers: allTransfers.length,
  })

  return {
    matched: Array.from(matched),
    unsupported: Array.from(unsupported),
    messages: allMessages,
    transfers: allTransfers,
  }
}

export function createAbstractTokenLookup(
  abstractTokens: (AbstractTokenRecord & {
    deployedTokens: { chain: string; address: string }[]
  })[],
): (deployedToken: ChainSpecificAddress) => AbstractTokenRecord | undefined {
  const byDeployed = new Map<string, AbstractTokenRecord>()

  for (const abstractToken of abstractTokens) {
    const { deployedTokens, ...record } = abstractToken
    for (const deployedToken of deployedTokens) {
      const key = toChainSpecificKeyFromDeployedToken(deployedToken)
      if (!key) {
        continue
      }
      byDeployed.set(key, record)
    }
  }

  return (deployedToken) => byDeployed.get(toChainSpecificKey(deployedToken))
}

function createFilteredDb(
  db: InteropEventDb,
  isExcluded: (event: InteropEvent) => boolean,
): InteropEventDb {
  const filterEvents = <T>(events: InteropEvent<T>[]) =>
    events.filter((event) => !isExcluded(event))

  return {
    find<T>(type: InteropEventType<T>, query: InteropEventQuery<T>) {
      return filterEvents(db.findAll(type, query))[0]
    },
    findAll<T>(type: InteropEventType<T>, query: InteropEventQuery<T>) {
      return filterEvents(db.findAll(type, query))
    },
    findApproximate<T>(
      type: InteropEventType<T>,
      query: InteropEventQuery<T>,
      approximate: InteropApproximateQuery<T>,
    ) {
      return filterEvents(db.findApproximate(type, query, approximate))
    },
  }
}

function toChainSpecificKey(value: ChainSpecificAddress) {
  const chain = ChainSpecificAddress.chain(value).toLowerCase()
  const address = ChainSpecificAddress.address(value).toLowerCase()
  return `${chain}:${address}`
}

function toChainSpecificKeyFromDeployedToken(deployedToken: {
  chain: string
  address: string
}) {
  if (deployedToken.address === 'native') {
    return
  }

  try {
    const chainSpecific = ChainSpecificAddress.fromLong(
      deployedToken.chain,
      deployedToken.address,
    )
    return toChainSpecificKey(chainSpecific)
  } catch {
    try {
      const chainSpecific = ChainSpecificAddress.from(
        deployedToken.chain,
        deployedToken.address,
      )
      return toChainSpecificKey(chainSpecific)
    } catch {
      return
    }
  }
}

function toMessageRecord(message: InteropMessage): InteropMessageRecord {
  return {
    plugin: message.plugin,
    messageId: generateId('M'),
    type: message.type,
    app: message.app,
    duration: Math.max(
      message.dst.ctx.timestamp - message.src.ctx.timestamp,
      0,
    ),
    timestamp: Math.max(message.src.ctx.timestamp, message.dst.ctx.timestamp),

    srcChain: message.src.ctx.chain,
    srcTime: message.src.ctx.timestamp,
    srcEventId: message.src.eventId,
    srcLogIndex: message.src.ctx.logIndex,
    srcTxHash: message.src.ctx.txHash,

    dstChain: message.dst.ctx.chain,
    dstTime: message.dst.ctx.timestamp,
    dstEventId: message.dst.eventId,
    dstLogIndex: message.dst.ctx.logIndex,
    dstTxHash: message.dst.ctx.txHash,
  }
}

function toTransferRecord(transfer: InteropTransfer): InteropTransferRecord {
  return {
    plugin: transfer.plugin,
    transferId: generateId('T'),
    type: transfer.type,
    duration: Math.max(
      transfer.dst.event.ctx.timestamp - transfer.src.event.ctx.timestamp,
      0,
    ),
    timestamp: Math.max(
      transfer.src.event.ctx.timestamp,
      transfer.dst.event.ctx.timestamp,
    ),

    srcChain: transfer.src.event.ctx.chain,
    srcTime: transfer.src.event.ctx.timestamp,
    srcEventId: transfer.src.event.eventId,
    srcLogIndex: transfer.src.event.ctx.logIndex,
    srcTxHash: transfer.src.event.ctx.txHash,

    srcTokenAddress: transfer.src.tokenAddress,
    srcRawAmount: transfer.src.tokenAmount,
    srcWasBurned: transfer.src.wasBurned,
    srcSymbol: undefined,
    srcAbstractTokenId: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    srcValueUsd: undefined,

    dstChain: transfer.dst.event.ctx.chain,
    dstTime: transfer.dst.event.ctx.timestamp,
    dstEventId: transfer.dst.event.eventId,
    dstLogIndex: transfer.dst.event.ctx.logIndex,
    dstTxHash: transfer.dst.event.ctx.txHash,

    dstTokenAddress: transfer.dst.tokenAddress,
    dstRawAmount: transfer.dst.tokenAmount,
    dstWasMinted: transfer.dst.wasMinted,
    dstSymbol: undefined,
    dstAbstractTokenId: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    dstValueUsd: undefined,

    isProcessed: false,
  }
}
