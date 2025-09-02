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

export type ChainAddress = string
export type ChainHash = string

export interface TxDetails {
  timestamp: number
  chain: string
  hash: ChainHash
  blockNumber: number
  blockHash: string
}

export interface Event<T = unknown> {
  eventId: string
  type: string
  tx: TxDetails
  args: T
}

export interface Message {
  type: string
  outbound: Event
  inbound: Event
}

export interface TransferSide {
  tx: TxDetails
  tokenAddress?: ChainAddress
  tokenId?: string
  amount?: string
  valueUsd?: number
}

export interface Transfer {
  type: string
  events: Event[]
  outbound: TransferSide
  inbound: TransferSide
}

export function generateId(type: string) {
  return `${type}:${randomUUID()}`
}

export interface EventType<T> {
  type: string
  create(tx: Event['tx'], payload: T): Event<T>
  checkType(action: Event): action is Event<T>
}

export function createEventType<T>(type: string): EventType<T> {
  if (!/\w+\.\w+/.test(type)) {
    throw new Error('Actions type must have the format: "plugin.action"')
  }

  return {
    type,
    create(tx: Event['tx'], payload: T): Event<T> {
      return {
        eventId: generateId('E'),
        type,
        tx,
        // Ensure it can be saved to db
        args: JSON.parse(JSON.stringify(payload)),
      }
    },
    checkType(action: Event): action is Event<T> {
      return action.type === type
    },
  }
}

export interface LogToDecode {
  log: Log
  tx: TxDetails
  txLogs: Log[]
  txTo?: ChainAddress
}

export interface MatchResult {
  message?: Message
  transfer?: Transfer
}

export interface EventDb {
  find<T>(type: EventType<T>, query?: Partial<T>): Event<T> | undefined
  findAll<T>(type: EventType<T>, query?: Partial<T>): Event<T>[]
}

export interface Plugin {
  name: string
  decode?: (
    input: LogToDecode,
    // biome-ignore lint/suspicious/noConfusingVoidType: Otherwise it's painful to write
  ) => Event | undefined | void | Promise<Event | undefined | void>
  match?: (
    action: Event,
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
): (log: Log) => ParsedEvent<ParseAbiItem<T>> | undefined {
  const eventName = eventSignature.slice(
    'event '.length,
    eventSignature.indexOf('('),
  )
  const abi = parseAbi([eventSignature as string])
  // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
  const topic0 = encodeEventTopics({ abi, eventName } as any)[0]

  return function parseEvent(
    log: Log,
  ): ParsedEvent<ParseAbiItem<T>> | undefined {
    if (!topic0 || log.topics?.[0] !== topic0) return undefined
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
