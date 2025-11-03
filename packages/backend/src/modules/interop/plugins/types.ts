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

Address32.fromOrUndefined = function fromOrUndefined(
  value: string | undefined,
) {
  if (!value) {
    return undefined
  }
  try {
    return Address32.from(value)
  } catch {
    return undefined
  }
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

Address32.cropToEthereumAddress = function cropToEthereumAddress(
  value: Address32,
) {
  return EthereumAddress(`0x${value.slice(-40)}`)
}

Address32.ZERO = Address32.from('0x')
Address32.NATIVE = Address32('native')

export interface InteropEventContext {
  timestamp: UnixTime
  chain: string
  blockNumber: number
  blockHash: string
  txHash: string
  txValue?: bigint
  txTo?: Address32
  txFrom?: Address32
  logIndex: number
  txData: string
}

export interface InteropEvent<T = unknown> {
  plugin: string
  eventId: string
  type: string
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
}

export interface InteropTransfer {
  kind: 'InteropTransfer'
  plugin: string
  type: string
  events: InteropEvent[]
  src: TransferSide
  dst: TransferSide
}

export interface InteropIgnore {
  kind: 'InteropIgnore'
  events: InteropEvent[]
}

export function generateId(type: string) {
  return `${type}-${randomUUID()}`
}

export interface InteropEventType<T> {
  type: string
  create(ctx: InteropEventContext, payload: T): Omit<InteropEvent<T>, 'plugin'>
  checkType(action: InteropEvent): action is InteropEvent<T>
}

export function createInteropEventType<T>(
  type: string,
  options?: { ttl?: number },
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
    create(
      ctx: InteropEventContext,
      payload: T,
    ): Omit<InteropEvent<T>, 'plugin'> {
      return {
        eventId: generateId('evt'),
        type,
        expiresAt: ctx.timestamp + ttl,
        ctx,
        // Ensure it can be saved to db
        args: JSON.parse(JSON.stringify(payload)),
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
  ctx: InteropEventContext
}

export interface TxToCapture {
  tx: InteropEventContext
  txLogs: Log[]
}

export type MatchResult = (
  | Omit<InteropMessage, 'plugin'>
  | Omit<InteropTransfer, 'plugin'>
  | InteropIgnore
)[]

export type InteropEventQuery<T> = Partial<T> & {
  ctx?: Partial<InteropEventContext>
  sameTxBefore?: InteropEvent
  sameTxAfter?: InteropEvent
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
}

export interface InteropPlugin {
  name: string
  capture?: (input: LogToCapture) => Omit<InteropEvent, 'plugin'>[] | undefined
  captureTx?: (input: TxToCapture) => Omit<InteropEvent, 'plugin'>[] | undefined
  matchTypes?: InteropEventType<unknown>[]
  match?: (
    event: InteropEvent,
    db: InteropEventDb,
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

  dstEvent: InteropEvent
  dstTokenAddress?: Address32
  dstAmount?: bigint

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
