import { EthereumAddress } from '@l2beat/shared-pure'
import { randomUUID } from 'crypto'
import {
  type Abi,
  type ContractEventName,
  type DecodeEventLogReturnType,
  decodeEventLog,
  encodeEventTopics,
  type Log,
  type ParseAbiItem,
  parseAbi,
} from 'viem'

export interface BridgeEventContext {
  timestamp: number
  chain: string
  blockNumber: number
  blockHash: string
  txHash: string
  txTo?: EthereumAddress
  logIndex: number
}

export interface BridgeEvent<T = unknown> {
  eventId: string
  type: string
  expiresAt: number
  ctx: BridgeEventContext
  args: T
}

export interface BridgeMessage {
  type: string
  outbound: BridgeEvent
  inbound: BridgeEvent
}

export interface TransferSide {
  tx: BridgeEventContext
  tokenAddress?: EthereumAddress
  tokenId?: string
  amount?: string
  valueUsd?: number
}

export interface BridgeTransfer {
  type: string
  events: BridgeEvent[]
  outbound: TransferSide
  inbound: TransferSide
}

export function generateId(type: string) {
  return `${type}:${randomUUID()}`
}

export interface BridgeEventType<T> {
  type: string
  create(ctx: BridgeEventContext, payload: T): BridgeEvent<T>
  checkType(action: BridgeEvent): action is BridgeEvent<T>
}

export function createBridgeEventType<T>(
  type: string,
  options?: { ttlMs?: number },
): BridgeEventType<T> {
  if (!/\w+\.\w+/.test(type)) {
    throw new Error('Actions type must have the format: "plugin.action"')
  }

  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const ttl = options?.ttlMs ?? ONE_DAY_MS

  return {
    type,
    create(ctx: BridgeEventContext, payload: T): BridgeEvent<T> {
      return {
        eventId: generateId('E'),
        type,
        expiresAt: Date.now() + ttl,
        ctx,
        // Ensure it can be saved to db
        args: JSON.parse(JSON.stringify(payload)),
      }
    },
    checkType(action: BridgeEvent): action is BridgeEvent<T> {
      return action.type === type
    },
  }
}

export interface LogToCapture {
  log: Log
  txLogs: Log[]
  ctx: BridgeEventContext
}

export interface MatchResult {
  message?: BridgeMessage
  transfer?: BridgeTransfer
}

export interface EventDb {
  find<T>(
    type: BridgeEventType<T>,
    query?: Partial<T>,
  ): BridgeEvent<T> | undefined
  findAll<T>(type: BridgeEventType<T>, query?: Partial<T>): BridgeEvent<T>[]
}

export interface BridgePlugin {
  name: string
  chains: string[]
  capture?: (
    input: LogToCapture,
    // biome-ignore lint/suspicious/noConfusingVoidType: Otherwise it's painful to write
  ) => BridgeEvent | undefined | void | Promise<BridgeEvent | undefined | void>
  match?: (
    event: BridgeEvent,
    db: EventDb,
    // biome-ignore lint/suspicious/noConfusingVoidType: Otherwise it's painful to write
  ) => MatchResult | undefined | void | Promise<MatchResult | undefined | void>
}

export type ParsedEvent<T extends Abi[number]> = DecodeEventLogReturnType<
  [T],
  ContractEventName<[T]>
>['args']

export function createEventParser<T extends `event ${string}(${string}`>(
  eventSignature: T,
): (
  log: Log,
  adddressWhitelist: EthereumAddress[] | null,
) => ParsedEvent<ParseAbiItem<T>> | undefined {
  const eventName = eventSignature.slice(
    'event '.length,
    eventSignature.indexOf('('),
  )
  const abi = parseAbi([eventSignature as string])
  // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
  const topic0 = encodeEventTopics({ abi, eventName } as any)[0]

  return function parseEvent(
    log: Log,
    adddressWhitelist: EthereumAddress[] | null,
  ): ParsedEvent<ParseAbiItem<T>> | undefined {
    if (!topic0 || log.topics?.[0] !== topic0) return undefined
    if (
      adddressWhitelist &&
      !adddressWhitelist.includes(EthereumAddress(log.address))
    ) {
      return
    }

    try {
      const { args } = decodeEventLog({
        abi,
        eventName,
        data: log.data,
        topics: log.topics,
      })
      return args as ParsedEvent<ParseAbiItem<T>>
    } catch {
      return undefined
    }
  }
}
