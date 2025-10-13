import { type Branded, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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

export type Address32 = Branded<string, 'Address32'>

export function Address32(value: string) {
  if (/^0x[a-f0-9]{64}$/.test(value) || value === 'native') {
    return value as Address32
  }
  throw new Error('Invalid Bytes32Address')
}

Address32.from = function from(value: string | EthereumAddress) {
  if (value === 'native') {
    return value as Address32
  }
  if (/^0x[a-f0-9]*$/i.test(value) && value.length <= 66) {
    return ('0x' + value.slice(2).toLowerCase().padStart(64, '0')) as Address32
  }
  throw new Error('Cannot create Bytes32Address')
}

Address32.ZERO = Address32.from('0x')
Address32.NATIVE = Address32('native')

export interface BridgeEventContext {
  timestamp: UnixTime
  chain: string
  blockNumber: number
  blockHash: string
  txHash: string
  value: string
  txTo?: Address32
  logIndex: number
}

export interface BridgeEvent<T = unknown> {
  plugin: string
  eventId: string
  type: string
  expiresAt: UnixTime
  ctx: BridgeEventContext
  args: T
}

export interface BridgeMessage {
  plugin: string
  kind: 'BridgeMessage'
  app: string
  type: string
  events: BridgeEvent[]
  src: BridgeEvent
  dst: BridgeEvent
}

export interface TransferSide {
  event: BridgeEvent
  tokenAddress?: Address32
  tokenAmount?: string
}

export interface BridgeTransfer {
  kind: 'BridgeTransfer'
  plugin: string
  type: string
  events: BridgeEvent[]
  src: TransferSide
  dst: TransferSide
}

export function generateId(type: string) {
  return `${type}-${randomUUID()}`
}

export interface BridgeEventType<T> {
  type: string
  create(ctx: BridgeEventContext, payload: T): Omit<BridgeEvent<T>, 'plugin'>
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
    create(
      ctx: BridgeEventContext,
      payload: T,
    ): Omit<BridgeEvent<T>, 'plugin'> {
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

export type MatchResult = (
  | Omit<BridgeMessage, 'plugin'>
  | Omit<BridgeTransfer, 'plugin'>
)[]

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
  ) =>
    | Omit<BridgeEvent, 'plugin'>
    | undefined
    | Promise<Omit<BridgeEvent, 'plugin'> | undefined>
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

interface BridgeMessageOptions {
  app: string
  srcEvent: BridgeEvent
  dstEvent: BridgeEvent
  extraEvents?: BridgeEvent[]
}

function Message(
  type: string,
  options: BridgeMessageOptions,
): Omit<BridgeMessage, 'plugin'> {
  if (!/\w+\.\w+(\.\w+)?/.test(type)) {
    throw new Error(
      'BridgeMessage type must have the format: "protocol-name.MessageName" or "protocol-name.MessageName.app-name"',
    )
  }
  return {
    kind: 'BridgeMessage',
    type,
    app: options.app,
    src: options.srcEvent,
    dst: options.dstEvent,
    events: [
      options.srcEvent,
      options.dstEvent,
      ...(options.extraEvents ?? []),
    ],
  }
}

export interface BridgeTransferOptions {
  srcEvent: BridgeEvent
  srcTokenAddress?: Address32
  srcAmount?: string

  dstEvent: BridgeEvent
  dstTokenAddress?: Address32
  dstAmount?: string

  extraEvents?: BridgeEvent[]
}

function Transfer(
  type: string,
  options: BridgeTransferOptions,
): Omit<BridgeTransfer, 'plugin'> {
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
      tokenAmount: options.srcAmount,
    },
    dst: {
      event: options.dstEvent,
      tokenAddress: options.dstTokenAddress,
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
