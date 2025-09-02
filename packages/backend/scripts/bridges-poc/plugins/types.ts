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

export interface Action<T = unknown> {
  actionId: string
  type: string
  tx: TxDetails
  payload: T
}

export interface Message {
  messageId: string
  type: string
  outbound: Action
  inbound: Action
}

export interface TransferSide {
  tx: TxDetails
  tokenAddress?: ChainAddress
  tokenId?: string
  amount?: string
  valueUsd?: number
}

export interface Transfer {
  transferId: string
  type: string
  actions: Action[]
  outbound: TransferSide
  inbound: TransferSide
}

export function generateId(type: string) {
  return `${type}:${randomUUID()}`
}

export interface ActionType<T> {
  type: string
  create(tx: Action['tx'], payload: T): Action<T>
  checkType(action: Action): action is Action<T>
}

export function createActionType<T>(type: string): ActionType<T> {
  if (!/\w+\.\w+/.test(type)) {
    throw new Error('Actions type must have the format: "plugin.action"')
  }

  return {
    type,
    create(tx: Action['tx'], payload: T): Action<T> {
      return {
        actionId: generateId('A'),
        type,
        tx,
        // Ensure it can be saved to db
        payload: JSON.parse(JSON.stringify(payload)),
      }
    },
    checkType(action: Action): action is Action<T> {
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

export interface ActionDb {
  find<T>(type: ActionType<T>, query?: Partial<T>): Action<T> | undefined
  findAll<T>(type: ActionType<T>, query?: Partial<T>): Action<T>[]
}

export interface Plugin {
  name: string
  decodeLog?: (
    input: LogToDecode,
    // biome-ignore lint/suspicious/noConfusingVoidType: Otherwise it's painful to write
  ) => Action | undefined | void | Promise<Action | undefined | void>
  matchAction?: (
    action: Action,
    db: ActionDb,
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
