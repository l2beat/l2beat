import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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
  timestamp: UnixTime
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
  expiresAt: UnixTime
  ctx: BridgeEventContext
  args: T
}

export interface BridgeMessage {
  type: string
  outbound: BridgeEvent
  inbound: BridgeEvent
}

export interface TransferSide {
  event: BridgeEvent
  token?: {
    address: EthereumAddress
    amount: string
  }
}

export type TransferSideWithFinancials = TransferSide & {
  financials?: {
    valueUsd: number
    price: number
    amount: number
    symbol: string
  }
}

export interface BridgeTransfer {
  type: string
  events: BridgeEvent[]
  outbound: TransferSide
  inbound: TransferSide
}

export type BridgeTransferWithFinancials = BridgeTransfer & {
  outbound: TransferSideWithFinancials
  inbound: TransferSideWithFinancials
}

export function generateId(type: string) {
  return `${type}-${randomUUID()}`
}

export interface BridgeEventType<T> {
  type: string
  create(ctx: BridgeEventContext, payload: T): BridgeEvent<T>
  checkType(action: BridgeEvent): action is BridgeEvent<T>
}

export function createBridgeEventType<T>(
  type: string,
  options?: { ttl?: number },
): BridgeEventType<T> {
  if (!/\w+\.\w+/.test(type)) {
    throw new Error('BridgeEventType must have the format: "protocol.event"')
  }
  if (type.length > 64) {
    throw new Error('BridgeEventType cannot be longer than 64')
  }

  const ttl = options?.ttl ?? UnixTime.DAY

  return {
    type,
    create(ctx: BridgeEventContext, payload: T): BridgeEvent<T> {
      return {
        eventId: generateId('evt'),
        type,
        expiresAt: ctx.timestamp + ttl,
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
  messages?: BridgeMessage[]
  transfers?: BridgeTransfer[]
}

export interface BridgeEventDb {
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
  ) => BridgeEvent | undefined | Promise<BridgeEvent | undefined>
  match?: (
    event: BridgeEvent,
    db: BridgeEventDb,
  ) => MatchResult | undefined | Promise<MatchResult | undefined>
}

export type ParsedEvent<T extends Abi[number]> = DecodeEventLogReturnType<
  [T],
  ContractEventName<[T]>
>['args']

export function createEventParser<T extends `event ${string}(${string}`>(
  eventSignature: T,
): (
  log: Log,
  addressWhitelist: EthereumAddress[] | null,
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
    addressWhitelist: EthereumAddress[] | null,
  ): ParsedEvent<ParseAbiItem<T>> | undefined {
    if (!topic0 || log.topics?.[0] !== topic0) return undefined
    if (
      addressWhitelist &&
      !addressWhitelist.includes(EthereumAddress(log.address))
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
