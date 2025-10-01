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
  kind: 'BridgeMessage'
  type: string
  src: BridgeEvent
  dst: BridgeEvent
}

export interface TransferSide {
  event: BridgeEvent
  tokenAddress?: EthereumAddress | 'native'
  tokenSymbol?: string
  tokenAmount?: string
}

export interface BridgeTransfer {
  kind: 'BridgeTransfer'
  type: string
  events: BridgeEvent[]
  src: TransferSide
  dst: TransferSide
}

export type TransferSideWithFinancials = TransferSide & {
  financials?: {
    valueUsd: number
    price: number
    amount: number
    symbol: string
  }
}

export type BridgeTransferWithFinancials = BridgeTransfer & {
  src: TransferSideWithFinancials
  dst: TransferSideWithFinancials
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
    throw new Error(
      'BridgeEventType must have the format: "protocol-name.EventName"',
    )
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

export type MatchResult = (BridgeMessage | BridgeTransfer)[]

export type BridgeEventQuery<T> = Partial<T> & {
  ctx?: Partial<BridgeEventContext>
  sameTxBefore?: BridgeEvent
  sameTxAfter?: BridgeEvent
}

export interface BridgeEventDb {
  find<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T> | undefined
  findAll<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T>[]
}

export interface BridgePlugin {
  name: string
  capture?: (
    input: LogToCapture,
  ) => BridgeEvent | undefined | Promise<BridgeEvent | undefined>
  matchTypes?: BridgeEventType<unknown>[]
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

export const Result = { Message, Transfer }

function Message(
  type: string,
  events: [src: BridgeEvent, dst: BridgeEvent],
): BridgeMessage {
  if (!/\w+\.\w+(\.\w+)?/.test(type)) {
    throw new Error(
      'BridgeMessage type must have the format: "protocol-name.MessageName" or "protocol-name.MessageName.app-name"',
    )
  }
  return {
    kind: 'BridgeMessage',
    type,
    src: events[0],
    dst: events[1],
  }
}

export interface BridgeTransferOptions {
  srcEvent: BridgeEvent
  srcTokenAddress?: EthereumAddress | 'native'
  srcTokenSymbol?: string
  srcAmount?: string

  dstEvent: BridgeEvent
  dstTokenAddress?: EthereumAddress | 'native'
  dstTokenSymbol?: string
  dstAmount?: string

  extraEvents?: BridgeEvent[]
}

function Transfer(
  type: string,
  options: BridgeTransferOptions,
): BridgeTransfer {
  if (!/\w+\.\w+(\.\w+)?/.test(type)) {
    throw new Error(
      'BridgeTransfer type must have the format: "app-name.Transfer" or "app-name.Transfer.app-name"',
    )
  }
  return {
    kind: 'BridgeTransfer',
    type,
    events: [
      options.srcEvent,
      options.dstEvent,
      ...(options.extraEvents ?? []),
    ],
    src: {
      event: options.srcEvent,
      tokenAddress: options.srcTokenAddress,
      tokenSymbol: options.srcTokenSymbol,
      tokenAmount: options.srcAmount,
    },
    dst: {
      event: options.dstEvent,
      tokenAddress: options.dstTokenAddress,
      tokenSymbol: options.dstTokenSymbol,
      tokenAmount: options.dstAmount,
    },
  }
}

export const definedNetworks: { protocol: string; chains: string[] }[] = []
export function defineNetworks<T extends { chain: string }>(
  protocol: string,
  networks: T[],
): T[] {
  definedNetworks.push({
    protocol,
    chains: networks.map((x) => x.chain),
  })
  return networks
}

export function findChain<C extends { chain: string }, P>(
  networks: C[],
  getProperty: (network: C) => P,
  propertyValue: P,
): string {
  return (
    networks.find((n) => getProperty(n) === propertyValue)?.chain ??
    `Unknown_${propertyValue}`
  )
}
