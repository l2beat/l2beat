import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { BinaryReader } from '../../../../tools/BinaryReader'
import { findBestTransferLog } from '../logScan'
import { createEventParser, findChain, type LogToCapture } from '../types'
import type { CCTPNetwork } from './cctp.config'

export const cctpMessageSentLog = 'event MessageSent(bytes message)'
export const parseCctpMessageSent = createEventParser(cctpMessageSentLog)

export const cctpV1MessageReceivedLog =
  'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)'
export const parseCctpV1MessageReceived = createEventParser(
  cctpV1MessageReceivedLog,
)

export const cctpV2MessageReceivedLog =
  'event MessageReceived(address indexed caller, uint32 sourceDomain, bytes32 indexed nonce, bytes32 sender, uint32 indexed finalityThresholdExecuted, bytes messageBody)'
export const parseCctpV2MessageReceived = createEventParser(
  cctpV2MessageReceivedLog,
)

export const cctpTransferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
export const parseCctpTransfer = createEventParser(cctpTransferLog)

export const cctpV1DepositForBurnLog =
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)'
export const parseCctpV1DepositForBurn = createEventParser(
  cctpV1DepositForBurnLog,
)

export const cctpV2DepositForBurnLog =
  'event DepositForBurn(address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller, uint256 maxFee, uint32 indexed minFinalityThreshold, bytes hookData)'
export const parseCctpV2DepositForBurn = createEventParser(
  cctpV2DepositForBurnLog,
)

export type CctpDepositForBurn = {
  version: 'v1' | 'v2'
  burnToken: string
  amount: bigint
  destinationDomain: number
  mintRecipient: string
}

export type CctpV1ReceivedTransfer = {
  version: 'v1'
  caller: EthereumAddress
  srcChain: string
  nonce: number
  messageBody: string
  burnMessage?: ReturnType<typeof decodeV1MessageBody>
  dstTokenAddress?: Address32
  dstAmount?: bigint
}

export type CctpV2ReceivedTransfer = {
  version: 'v2'
  app?: string
  hookData?: string
  caller: EthereumAddress
  srcChain: string
  nonce: number
  sender: EthereumAddress
  finalityThresholdExecuted: number
  messageHash: string
  burnMessage?: ReturnType<typeof decodeV2MessageBody>
  dstTokenAddress?: Address32
  dstAmount?: bigint
}

export type CctpReceivedTransfer =
  | CctpV1ReceivedTransfer
  | CctpV2ReceivedTransfer

export function parseCctpDepositForBurn(
  log: LogToCapture['txLogs'][number],
): CctpDepositForBurn | undefined {
  const v1 = parseCctpV1DepositForBurn(log, null)
  if (v1) {
    return {
      version: 'v1',
      burnToken: v1.burnToken,
      amount: v1.amount,
      destinationDomain: Number(v1.destinationDomain),
      mintRecipient: v1.mintRecipient,
    }
  }

  const v2 = parseCctpV2DepositForBurn(log, null)
  if (v2) {
    return {
      version: 'v2',
      burnToken: v2.burnToken,
      amount: v2.amount,
      destinationDomain: Number(v2.destinationDomain),
      mintRecipient: v2.mintRecipient,
    }
  }
}

export function findCctpDepositForBurn(
  logs: LogToCapture['txLogs'],
  options: {
    tokenAddress: string
    amount: bigint
    beforeLogIndex?: number
  },
): CctpDepositForBurn | undefined {
  for (const log of logs) {
    if (
      options.beforeLogIndex !== undefined &&
      (log.logIndex ?? 0) >= options.beforeLogIndex
    ) {
      continue
    }

    const depositForBurn = parseCctpDepositForBurn(log)
    if (!depositForBurn) continue

    if (
      depositForBurn.burnToken.toLowerCase() ===
        options.tokenAddress.toLowerCase() &&
      depositForBurn.amount === options.amount
    ) {
      return depositForBurn
    }
  }
}

export function parseCctpV1ReceivedTransfer(
  input: Pick<LogToCapture, 'chain' | 'log' | 'txLogs'>,
  networks: CCTPNetwork[],
): CctpV1ReceivedTransfer | undefined {
  const network = getNetworkWithMessageTransmitter(input.chain, networks)
  if (!network) return

  const received = parseCctpV1MessageReceived(input.log, [
    network.messageTransmitter,
  ])
  if (!received) return

  const burnMessage = decodeV1MessageBody(received.messageBody)
  const transferMatch = burnMessage
    ? findBestTransferLog(
        input.txLogs,
        burnMessage.amount,
        input.log.logIndex ?? -1,
        (log) => parseCctpTransfer(log, null),
      )
    : undefined

  return {
    version: 'v1',
    caller: EthereumAddress(received.caller),
    srcChain: findChain(
      networks,
      (x) => x.domain,
      Number(received.sourceDomain),
    ),
    nonce: Number(received.nonce),
    messageBody: received.messageBody,
    burnMessage,
    dstTokenAddress: transferMatch?.transfer
      ? Address32.from(transferMatch.transfer.logAddress)
      : undefined,
    dstAmount: transferMatch?.transfer?.value,
  }
}

export function parseCctpV2ReceivedTransfer(
  input: Pick<LogToCapture, 'chain' | 'log' | 'txLogs'>,
  networks: CCTPNetwork[],
): CctpV2ReceivedTransfer | undefined {
  const network = getNetworkWithMessageTransmitter(input.chain, networks)
  if (!network) return

  const received = parseCctpV2MessageReceived(input.log, [
    network.messageTransmitter,
  ])
  if (!received) return

  const burnMessage = decodeV2MessageBody(received.messageBody)
  const messageHash = hashV2MessageBody(received.messageBody)
  if (!messageHash) return

  const transferMatch = findBestTransferLog(
    input.txLogs,
    burnMessage ? burnMessage.amount - burnMessage.feeExecuted : 0n,
    input.log.logIndex ?? -1,
    (log) => parseCctpTransfer(log, null),
  )

  return {
    version: 'v2',
    app: burnMessage ? 'TokenMessengerV2' : undefined,
    hookData: burnMessage?.hookData,
    caller: EthereumAddress(received.caller),
    srcChain: findChain(
      networks,
      (x) => x.domain,
      Number(received.sourceDomain),
    ),
    nonce: Number(received.nonce),
    sender: EthereumAddress(`0x${received.sender.slice(-40)}`),
    finalityThresholdExecuted: Number(received.finalityThresholdExecuted),
    messageHash,
    burnMessage,
    dstTokenAddress: transferMatch.transfer
      ? Address32.from(transferMatch.transfer.logAddress)
      : undefined,
    dstAmount: transferMatch.transfer?.value,
  }
}

export function findCctpReceivedTransfer(
  input: Pick<LogToCapture, 'chain' | 'txLogs'>,
  options: {
    v1Networks?: CCTPNetwork[]
    v2Networks?: CCTPNetwork[]
    srcChain?: string
    dstTokenAddress?: Address32
    dstAmount?: bigint
  },
): CctpReceivedTransfer | undefined {
  for (const log of input.txLogs) {
    const candidate =
      parseCctpV1ReceivedTransfer(
        { ...input, log },
        options.v1Networks ?? [],
      ) ??
      parseCctpV2ReceivedTransfer({ ...input, log }, options.v2Networks ?? [])

    if (candidate && matchesReceivedTransfer(candidate, options)) {
      return candidate
    }
  }
}

export function decodeMessageVersion(encodedHex: string) {
  try {
    return new BinaryReader(encodedHex).readUint32()
  } catch {
    return undefined
  }
}

// https://basescan.org/address/0xad09780d193884d503182ad4588450c416d6f9d4#code#L1285
export function decodeV1Message(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const sourceDomain = reader.readUint32()
    const destinationDomain = reader.readUint32()
    const nonce = reader.readUint64()
    const sender = reader.readBytes(32)
    const recipient = reader.readBytes(32)
    const destinationCaller = reader.readBytes(32)
    const rawBody = reader.readRemainingBytes()
    return {
      version,
      sourceDomain,
      destinationDomain,
      nonce,
      sender,
      recipient,
      destinationCaller,
      rawBody,
    }
  } catch {
    return undefined
  }
}

// https://developers.circle.com/cctp/v1/message-format
export function decodeV1MessageBody(encodedHex: string) {
  try {
    if ((encodedHex.length - 2) / 2 !== 4 + 32 + 32 + 32 + 32) {
      return undefined
    }

    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    if (version !== 0) return undefined
    const burnToken = reader.readBytes(32)
    const mintRecipient = reader.readBytes(32)
    const amount = reader.readUint256()
    const messageSender = reader.readBytes(32)
    return {
      version,
      burnToken,
      mintRecipient,
      amount,
      messageSender,
    }
  } catch {
    return undefined
  }
}

// https://basescan.org/address/0x7db629f6acc20be49a0a7565c21cc178e9ac21e3#code#F4#L78
export function decodeV2Message(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const sourceDomain = reader.readUint32()
    const destinationDomain = reader.readUint32()
    const nonce = reader.readUint256()
    const sender = reader.readBytes(32)
    const recipient = reader.readBytes(32)
    const destinationCaller = reader.readBytes(32)
    const minFinalityThreshold = reader.readUint32()
    const finalityThresholdExecuted = reader.readUint32()
    const messageBody = reader.readRemainingBytes()
    return {
      version,
      sourceDomain,
      destinationDomain,
      nonce,
      sender,
      recipient,
      destinationCaller,
      minFinalityThreshold,
      finalityThresholdExecuted,
      messageBody,
    }
  } catch {
    return undefined
  }
}

export function hashV2MessageBody(encodedHex: string): string | undefined {
  const messageBody = decodeV2MessageBody(encodedHex)
  if (!messageBody) return undefined
  return solidityKeccak256(
    ['uint32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'uint256', 'bytes'],
    [
      messageBody.version,
      messageBody.burnToken,
      messageBody.mintRecipient,
      messageBody.amount,
      messageBody.messageSender,
      messageBody.maxFee,
      messageBody.hookData,
    ],
  )
}

export function decodeV2MessageBody(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const burnToken = reader.readBytes(32)
    const mintRecipient = reader.readBytes(32)
    const amount = reader.readUint256()
    const messageSender = reader.readBytes(32)
    const maxFee = reader.readUint256()
    const feeExecuted = reader.readUint256()
    const expirationBlock = reader.readUint256()
    const hookData = reader.readRemainingBytes()
    return {
      version,
      burnToken,
      mintRecipient,
      amount,
      messageSender,
      maxFee,
      feeExecuted,
      expirationBlock,
      hookData,
    }
  } catch {
    return undefined
  }
}

function getNetworkWithMessageTransmitter(
  chain: string,
  networks: CCTPNetwork[],
): (CCTPNetwork & { messageTransmitter: EthereumAddress }) | undefined {
  const network = networks.find((n) => n.chain === chain)
  if (!network?.messageTransmitter) return

  return network as CCTPNetwork & { messageTransmitter: EthereumAddress }
}

function matchesReceivedTransfer(
  candidate: CctpReceivedTransfer,
  options: {
    srcChain?: string
    dstTokenAddress?: Address32
    dstAmount?: bigint
  },
): boolean {
  if (options.srcChain && candidate.srcChain !== options.srcChain) return false
  if (
    options.dstTokenAddress &&
    candidate.dstTokenAddress !== options.dstTokenAddress
  ) {
    return false
  }
  if (
    options.dstAmount !== undefined &&
    candidate.dstAmount !== options.dstAmount
  ) {
    return false
  }

  return true
}
