import type { RpcClient } from '@l2beat/shared'
import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import {
  decodeEventLog,
  encodeEventTopics,
  type Hex,
  type Log,
  parseAbi,
} from 'viem'
import type { Chain } from '../../chains'
import type { Receive } from '../../types/Receive'
import type { Send } from '../../types/Send'

export const CCTPV2 = {
  name: 'cctpv2',
  decoder: decoder,
}

async function decoder(
  chain: Chain & { rpc: RpcClient },
  log: Log,
): Promise<Send | Receive | undefined> {
  const bridge = BRIDGES.find((b) => b.chainShortName === chain.shortName)

  if (!bridge) {
    return undefined
  }

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'DepositForBurn' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
      eventName: 'DepositForBurn',
    })

    const nonce = computeV2DeterministicNonce(
      bridge.domain,
      BigInt(data.args.destinationDomain),
      data.args.burnToken,
      data.args.mintRecipient,
      data.args.amount,
      data.args.depositor,
      data.args.maxFee,
      data.args.hookData,
    )

    return {
      direction: 'send',
      protocol: CCTPV2.name,
      token: ChainSpecificAddress(`${chain.shortName}:${data.args.burnToken}`),
      amount: data.args.amount,
      destination: data.args.destinationDomain.toString(),
      blockNumber: log.blockNumber ?? undefined,
      txHash: log.transactionHash ?? undefined,
      type: 'DepositForBurn',
      matchingId: idFor(bridge.domain, nonce),
    }
  }

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'MessageReceived' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
      eventName: 'MessageReceived',
    })

    assert(log.transactionHash)

    const txReceipt = await chain.rpc.getTransactionReceipt(log.transactionHash)

    const withdraw = txReceipt.logs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'MintAndWithdraw' })[0],
    )

    assert(withdraw, log.transactionHash)

    const withdrawData = decodeEventLog({
      abi: ABI,
      data: withdraw.data as Hex,
      topics: withdraw.topics as [signature: Hex, ...args: Hex[]] | [],
      eventName: 'MintAndWithdraw',
    })

    const decodedMessage = decodeV2MessageBody(data.args.messageBody)
    if (!decodedMessage) {
      console.error(
        'Failed to decode message body for v2 MessageReceived event',
      )
      return undefined
    }
    const nonce = computeV2DeterministicNonce(
      BigInt(data.args.sourceDomain),
      bridge.domain,
      decodedMessage.burnToken,
      decodedMessage.mintRecipient,
      decodedMessage.amount,
      decodedMessage.messageSender,
      decodedMessage.maxFee,
      decodedMessage.hookData,
    )

    return {
      direction: 'receive',
      protocol: CCTPV2.name,
      token: ChainSpecificAddress(
        `${chain.shortName}:${withdrawData.args.mintToken}`,
      ),
      amount: withdrawData.args.amount,
      origin: data.args.sourceDomain.toString(),
      blockNumber: log.blockNumber ?? undefined,
      txHash: log.transactionHash ?? undefined,
      type: 'MessageReceived',
      matchingId: idFor(BigInt(data.args.sourceDomain), nonce),
    }
  }

  return undefined
}

const ABI = parseAbi([
  'event DepositForBurn(address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller, uint256 maxFee, uint32 indexed minFinalityThreshold, bytes hookData)',
  'event MessageReceived(address indexed caller, uint32 sourceDomain, bytes32 indexed nonce, bytes32 sender, uint32 indexed finalityThresholdExecuted, bytes messageBody)',
  'event MintAndWithdraw(address indexed mintRecipient, uint256 amount, address indexed mintToken, uint256 feeCollected)',
])

const BRIDGES = [
  {
    domain: 0n,
    chainShortName: 'eth',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
  },
  {
    domain: 3n,
    chainShortName: 'arb1',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
  },
  {
    domain: 2n,
    chainShortName: 'oeth',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
  },
  {
    domain: 6n,
    chainShortName: 'base',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
  },
  {
    domain: 10n,
    chainShortName: 'unichain',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
  },
  {
    domain: 11n,
    chainShortName: 'linea',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
  },
]

const idFor = (domain: bigint, nonce: bigint | string) =>
  `${domain}_${nonce}` as const

function computeV2DeterministicNonce(
  sourceDomain: bigint,
  destinationDomain: bigint,
  burnToken: string,
  mintRecipient: string,
  amount: bigint,
  messageSender: string,
  maxFee: bigint,
  hookData: string,
): string {
  try {
    // Normalize all inputs to consistent format
    const sourceDomainHex = sourceDomain.toString(16).padStart(8, '0')
    const destinationDomainHex = destinationDomain.toString(16).padStart(8, '0')
    const burnTokenHex = burnToken.slice(2).padStart(64, '0')
    const mintRecipientHex = mintRecipient.slice(2).padStart(64, '0')
    const amountHex = amount.toString(16).padStart(64, '0')
    const messageSenderHex = messageSender.slice(2).padStart(64, '0')
    const maxFeeHex = maxFee.toString(16).padStart(64, '0')
    const hookDataHex = hookData.startsWith('0x') ? hookData.slice(2) : hookData

    // Concatenate all components for consistent hashing
    const concatenated =
      sourceDomainHex +
      destinationDomainHex +
      burnTokenHex +
      mintRecipientHex +
      amountHex +
      messageSenderHex +
      maxFeeHex +
      hookDataHex

    // Use built-in crypto for hashing (Node.js built-in)
    const crypto = require('crypto')
    const hash = crypto
      .createHash('sha256')
      .update(concatenated, 'hex')
      .digest('hex')

    return '0x' + hash
  } catch (error) {
    console.error('Failed to compute deterministic nonce:', error)
    // Fallback to timestamp-based nonce if computation fails
    return '0x' + Date.now().toString(16).padStart(64, '0')
  }
}

function decodeV2MessageBody(messageBody: string): {
  version: number
  burnToken: string
  mintRecipient: string
  amount: bigint
  messageSender: string
  maxFee: bigint
  feeExecuted: bigint
  expirationBlock: bigint
  hookData: string
} | null {
  try {
    // Remove 0x prefix if present
    const hex = messageBody.startsWith('0x')
      ? messageBody.slice(2)
      : messageBody

    // Validate minimum length (228 bytes = 456 hex chars for fixed fields)
    if (hex.length < 456) return null

    let offset = 0

    // Parse version (4 bytes)
    const version = Number.parseInt(hex.slice(offset, offset + 8), 16)
    offset += 8

    // Parse burnToken (32 bytes)
    const burnToken = '0x' + hex.slice(offset, offset + 64)
    offset += 64

    // Parse mintRecipient (32 bytes)
    const mintRecipient = '0x' + hex.slice(offset, offset + 64)
    offset += 64

    // Parse amount (32 bytes)
    const amount = BigInt('0x' + hex.slice(offset, offset + 64))
    offset += 64

    // Parse messageSender (32 bytes)
    const messageSender = '0x' + hex.slice(offset, offset + 64)
    offset += 64

    // Parse maxFee (32 bytes)
    const maxFee = BigInt('0x' + hex.slice(offset, offset + 64))
    offset += 64

    // Parse feeExecuted (32 bytes)
    const feeExecuted = BigInt('0x' + hex.slice(offset, offset + 64))
    offset += 64

    // Parse expirationBlock (32 bytes)
    const expirationBlock = BigInt('0x' + hex.slice(offset, offset + 64))
    offset += 64

    // Remaining bytes are hookData
    const hookData = hex.length > offset ? '0x' + hex.slice(offset) : '0x'

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
  } catch (error) {
    console.error('Failed to decode message body:', error)
    return null
  }
}
