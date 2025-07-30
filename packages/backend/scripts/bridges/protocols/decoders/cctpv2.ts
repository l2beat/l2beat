import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'

export const CCTPV2 = {
  name: 'cctpv2',
  decoder: decoder,
}

const ABI = parseAbi([
  'event DepositForBurn(address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller, uint256 maxFee, uint32 indexed minFinalityThreshold, bytes hookData)',
  'event MessageReceived(address indexed caller, uint32 sourceDomain, bytes32 indexed nonce, bytes32 sender, uint32 indexed finalityThresholdExecuted, bytes messageBody)',
  'event MintAndWithdraw(address indexed mintRecipient, uint256 amount, address indexed mintToken, uint256 feeCollected)',
])

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) {
    return undefined
  }

  if (
    EthereumAddress(input.log.address) === network.tokenMessenger &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'DepositForBurn' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'DepositForBurn',
    })

    const nonce = computeV2DeterministicNonce(
      network.domain,
      data.args.destinationDomain,
      data.args.burnToken,
      data.args.mintRecipient,
      data.args.amount,
      data.args.depositor,
      data.args.maxFee,
      data.args.hookData,
    )

    const destination = NETWORKS.find(
      (b) => b.domain === data.args.destinationDomain,
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'outbound',
      application: CCTPV2.name,
      origin: chain.shortName,
      destination: destination ?? data.args.destinationDomain.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'DepositForBurn',
      matchingId: idFor(network.domain, nonce),
      amount: data.args.amount,
      token: network.usdc,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.messageTransmitter &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'MessageReceived' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'MessageReceived',
    })

    const decodedMessage = decodeV2MessageBody(data.args.messageBody)
    if (!decodedMessage) {
      console.error(
        'Failed to decode message body for v2 MessageReceived event',
      )
      return undefined
    }
    const nonce = computeV2DeterministicNonce(
      data.args.sourceDomain,
      network.domain,
      decodedMessage.burnToken,
      decodedMessage.mintRecipient,
      decodedMessage.amount,
      decodedMessage.messageSender,
      decodedMessage.maxFee,
      decodedMessage.hookData,
    )

    const origin = NETWORKS.find(
      (b) => b.domain === data.args.sourceDomain,
    )?.chainShortName

    const mintEvent = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'MintAndWithdraw' })[0],
    )
    assert(mintEvent, `Mint event not found ${input.transactionHash}`)
    const mintEventData = decodeEventLog({
      abi: ABI,
      data: mintEvent.data,
      topics: mintEvent.topics,
      eventName: 'MintAndWithdraw',
    })

    return {
      type: 'asset',
      direction: 'inbound',
      application: CCTPV2.name,
      origin: origin ?? data.args.sourceDomain.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'MessageReceived',
      matchingId: idFor(data.args.sourceDomain, nonce),
      amount: mintEventData.args.amount,
      token: network.usdc,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  return undefined
}

const NETWORKS = [
  {
    domain: 0,
    chainShortName: 'eth',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
    usdc: EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
  },
  {
    domain: 3,
    chainShortName: 'arb1',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
    usdc: EthereumAddress('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
  },
  {
    domain: 2,
    chainShortName: 'oeth',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
    usdc: EthereumAddress('0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'),
  },
  {
    domain: 6,
    chainShortName: 'base',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
    usdc: EthereumAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
  },
  {
    domain: 10,
    chainShortName: 'unichain',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
    usdc: EthereumAddress('0x078D782b760474a361dDA0AF3839290b0EF57AD6'),
  },
  {
    domain: 11,
    chainShortName: 'linea',
    tokenMessenger: EthereumAddress(
      '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
    ),
    messageTransmitter: EthereumAddress(
      '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    ),
    usdc: EthereumAddress('0x176211869cA2b568f2A7D4EE941E073a821EE1ff'),
  },
]

const idFor = (domain: number, nonce: bigint | string) =>
  `${domain}_${nonce}` as const

function computeV2DeterministicNonce(
  sourceDomain: number,
  destinationDomain: number,
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
