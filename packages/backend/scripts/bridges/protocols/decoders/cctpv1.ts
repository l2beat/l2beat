import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'

export const CCTPV1 = {
  name: 'cctpv1',
  decoder: decoder,
}

const ABI = parseAbi([
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)',
  'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)',
  'event MintAndWithdraw(address indexed mintRecipient,uint256 amount,address indexed mintToken)',
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

    const destination = NETWORKS.find(
      (b) => b.domain === data.args.destinationDomain,
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'outbound',
      application: CCTPV1.name,
      origin: chain.shortName,
      destination: destination ?? data.args.destinationDomain.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'DepositForBurn',
      matchingId: idFor(network.domain, data.args.nonce),
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
      application: CCTPV1.name,
      origin: origin ?? data.args.sourceDomain.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'MessageReceived',
      matchingId: idFor(data.args.sourceDomain, data.args.nonce),
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
      '0xBd3fa81B58Ba92a82136038B25aDec7066af3155',
    ),
    messageTransmitter: EthereumAddress(
      '0x0a992d191DEeC32aFe36203Ad87D7d289a738F81',
    ),
    usdc: EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
  },
  {
    domain: 3,
    chainShortName: 'arb1',
    tokenMessenger: EthereumAddress(
      '0x19330d10D9Cc8751218eaf51E8885D058642E08A',
    ),
    messageTransmitter: EthereumAddress(
      '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca',
    ),
    usdc: EthereumAddress('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
  },
  {
    domain: 2,
    chainShortName: 'oeth',
    tokenMessenger: EthereumAddress(
      '0x2B4069517957735bE00ceE0fadAE88a26365528f',
    ),
    messageTransmitter: EthereumAddress(
      '0x4D41f22c5a0e5c74090899E5a8Fb597a8842b3e8',
    ),
    usdc: EthereumAddress('0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'),
  },
  {
    domain: 6,
    chainShortName: 'base',
    tokenMessenger: EthereumAddress(
      '0x1682Ae6375C4E4A97e4B583BC394c861A46D8962',
    ),
    messageTransmitter: EthereumAddress(
      '0xAD09780d193884d503182aD4588450C416D6F9D4',
    ),
    usdc: EthereumAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
  },
  {
    domain: 10,
    chainShortName: 'unichain',
    tokenMessenger: EthereumAddress(
      '0x4e744b28E787c3aD0e810eD65A24461D4ac5a762',
    ),
    messageTransmitter: EthereumAddress(
      '0x353bE9E2E38AB1D19104534e4edC21c643Df86f4',
    ),
    usdc: EthereumAddress('0x078D782b760474a361dDA0AF3839290b0EF57AD6'),
  },
]

const idFor = (domain: number, nonce: bigint | string) =>
  `${domain}_${nonce}` as const
