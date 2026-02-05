import type { InteropPluginName } from '@l2beat/config'
import type {
  InteropEventContext,
  InteropTransferCategory,
} from '@l2beat/database'
import {
  type Address32,
  type Block,
  type ChainSpecificAddress,
  EthereumAddress,
  type Transaction,
  UnixTime,
} from '@l2beat/shared-pure'
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

export interface InteropEvent<T = unknown> {
  plugin: string
  eventId: string
  type: string
  direction?: 'incoming' | 'outgoing'
  expiresAt: UnixTime
  ctx: InteropEventContext
  args: T
}

export interface InteropMessage {
  plugin: string
  kind: 'InteropMessage'
  app: string
  type: string
  events: InteropEvent[]
  src: InteropEvent
  dst: InteropEvent
}

export interface TransferSide {
  event: InteropEvent
  tokenAddress?: Address32
  tokenAmount?: bigint
  wasBurned?: boolean
  wasMinted?: boolean
}

export interface InteropTransfer {
  kind: 'InteropTransfer'
  plugin: string
  type: string
  category?: InteropTransferCategory
  events: InteropEvent[]
  src: TransferSide
  dst: TransferSide
}

export interface InteropIgnore {
  kind: 'InteropIgnore'
  events: InteropEvent[]
}

const ABC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
function randomId() {
  let id = ''
  for (let i = 0; i < 10; i++) {
    id += ABC[Math.floor(Math.random() * ABC.length)]
  }
  return id
}

export function generateId(type: string) {
  return `${type}-${randomId()}`
}

export interface InteropEventType<T> {
  type: string
  create(capture: LogToCapture, payload: T): Omit<InteropEvent<T>, 'plugin'>
  createTx(capture: TxToCapture, payload: T): Omit<InteropEvent<T>, 'plugin'>
  createCtx(
    ctx: InteropEventContext,
    payload: T,
  ): Omit<InteropEvent<T>, 'plugin'>
  mock(args: T, expiresAt?: UnixTime): InteropEvent<T>
  checkType(action: InteropEvent): action is InteropEvent<T>
}

export function createInteropEventType<T>(
  type: string,
  options?: { ttl?: number; direction?: 'incoming' | 'outgoing' },
): InteropEventType<T> {
  if (!/\w+\.\w+/.test(type)) {
    throw new Error(
      'InteropEventType must have the format: "protocol-name.EventName"',
    )
  }
  if (type.length > 64) {
    throw new Error('InteropEventType cannot be longer than 64')
  }

  const ttl = options?.ttl ?? UnixTime.DAY

  return {
    type,
    create(capture: LogToCapture, args: T): Omit<InteropEvent<T>, 'plugin'> {
      return this.createCtx(
        {
          chain: capture.chain,
          logIndex: capture.log.logIndex ?? -1, // log.logIndex being null should never happen!
          timestamp: capture.block.timestamp,
          txHash: capture.tx.hash ?? '', // tx.hash being null should never happen!
        },
        args,
      )
    },
    createTx(capture: TxToCapture, args: T): Omit<InteropEvent<T>, 'plugin'> {
      return this.createCtx(
        {
          chain: capture.chain,
          logIndex: -1,
          timestamp: capture.block.timestamp,
          txHash: capture.tx.hash ?? '', // tx.hash being null should never happen!
        },
        args,
      )
    },
    createCtx(
      ctx: InteropEventContext,
      args: T,
    ): Omit<InteropEvent<T>, 'plugin'> {
      return {
        eventId: generateId('evt'),
        type,
        ...(options?.direction ? { direction: options.direction } : {}),
        expiresAt: ctx.timestamp + ttl,
        ctx,
        args,
      }
    },
    mock(args: T, expiresAt?: UnixTime): InteropEvent<T> {
      return {
        eventId: generateId('evt'),
        type,
        expiresAt: expiresAt ?? UnixTime.now() + ttl,
        plugin: '',
        args,
        ctx: { chain: '', logIndex: -1, timestamp: 0, txHash: '' },
      }
    },
    checkType(action: InteropEvent): action is InteropEvent<T> {
      return action.type === type
    },
  }
}

export interface LogToCapture {
  log: Log
  txLogs: Log[]
  tx: Transaction
  block: Block
  chain: string
}

export interface TxToCapture {
  txLogs: Log[]
  tx: Transaction
  block: Block
  chain: string
}

export type MatchResult = (
  | Omit<InteropMessage, 'plugin'>
  | Omit<InteropTransfer, 'plugin'>
  | InteropIgnore
)[]

export interface SameTxAtOffsetQuery {
  event: InteropEvent
  offset: number
}

export type InteropEventQuery<T> = Partial<T> & {
  ctx?: Partial<InteropEventContext>
  sameTxBefore?: InteropEvent
  sameTxAfter?: InteropEvent
  sameTxAtOffset?: SameTxAtOffsetQuery
}

export interface InteropApproximateQuery<T> {
  key: keyof T
  valueBigInt: bigint
  toleranceUp?: number
  toleranceDown?: number
}

export interface InteropEventDb {
  find<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T> | undefined
  findAll<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T>[]
  findApproximate<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
    approximate: InteropApproximateQuery<T>,
  ): InteropEvent<T>[]
}

export type DataRequest = EventDataRequest

interface EventDataRequest {
  type: 'event'
  signature: string
  includeTxEvents?: string[]
  includeTx?: boolean
  addresses: ChainSpecificAddress[]
}

export interface InteropPlugin {
  readonly name: InteropPluginName
  capture?: (input: LogToCapture) => Omit<InteropEvent, 'plugin'>[] | undefined
  captureTx?: (input: TxToCapture) => Omit<InteropEvent, 'plugin'>[] | undefined
  matchTypes?: InteropEventType<unknown>[]
  match?: (
    event: InteropEvent,
    db: InteropEventDb,
  ) => MatchResult | undefined | Promise<MatchResult | undefined>
}

export interface InteropPluginResyncable extends InteropPlugin {
  getDataRequests: () => DataRequest[]
  capture: (input: LogToCapture) => Omit<InteropEvent, 'plugin'>[] | undefined
}

export function isPluginResyncable(
  plugin: InteropPlugin,
): plugin is InteropPluginResyncable {
  return 'getDataRequests' in plugin
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

export const Result = { Ignore, Message, Transfer }

interface InteropMessageOptions {
  app: string
  srcEvent: InteropEvent
  dstEvent: InteropEvent
  extraEvents?: InteropEvent[]
}

function Ignore(events: InteropEvent[]): InteropIgnore {
  return {
    kind: 'InteropIgnore',
    events,
  }
}

function Message(
  type: string,
  options: InteropMessageOptions,
): Omit<InteropMessage, 'plugin'> {
  if (!/\w+\.\w+(\.\w+)?/.test(type)) {
    throw new Error(
      'InteropMessage type must have the format: "protocol-name.MessageName" or "protocol-name.MessageName.app-name"',
    )
  }
  return {
    kind: 'InteropMessage',
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

export interface InteropTransferOptions {
  srcEvent: InteropEvent
  srcTokenAddress?: Address32
  srcAmount?: bigint
  srcWasBurned?: boolean

  dstEvent: InteropEvent
  dstTokenAddress?: Address32
  dstAmount?: bigint
  dstWasMinted?: boolean

  category?: InteropTransferCategory
  extraEvents?: InteropEvent[]
}

function Transfer(
  type: string,
  options: InteropTransferOptions,
): Omit<InteropTransfer, 'plugin'> {
  if (!/\w+\.\w+(\.\w+)?/.test(type)) {
    throw new Error(
      'InteropTransfer type must have the format: "app-name.Transfer" or "app-name.Transfer.app-name"',
    )
  }
  return {
    kind: 'InteropTransfer',
    type,
    category: options.category,
    events: [
      options.srcEvent,
      options.dstEvent,
      ...(options.extraEvents ?? []),
    ],
    src: {
      event: options.srcEvent,
      tokenAddress: options.srcTokenAddress,
      tokenAmount: options.srcAmount,
      wasBurned: options.srcWasBurned,
    },
    dst: {
      event: options.dstEvent,
      tokenAddress: options.dstTokenAddress,
      tokenAmount: options.dstAmount,
      wasMinted: options.dstWasMinted,
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
