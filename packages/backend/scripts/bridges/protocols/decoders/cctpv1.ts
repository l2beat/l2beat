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

export const CCTPV1 = {
  name: 'cctpv1',
  decoder: decoder,
}

function decoder(
  chain: Chain,
  txLogs: { hash: string; logs: Log[] },
): Send | Receive | undefined {
  for (const log of txLogs.logs) {
    const bridge = BRIDGES.find((b) => b.chainShortName === chain.shortName)

    if (!bridge) {
      continue
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

      return {
        direction: 'send',
        protocol: CCTPV1.name,
        token: ChainSpecificAddress(
          `${chain.shortName}:${data.args.burnToken}`,
        ),
        amount: data.args.amount,
        destination: data.args.destinationDomain.toString(),
        blockNumber: log.blockNumber ?? undefined,
        txHash: log.transactionHash ?? undefined,
        type: 'DepositForBurn',
        matchingId: idFor(bridge.domain, data.args.nonce),
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

      const withdraw = txLogs.logs.find(
        (l) =>
          l.topics[0] ===
          encodeEventTopics({ abi: ABI, eventName: 'MintAndWithdraw' })[0],
      )

      assert(withdraw)

      const withdrawData = decodeEventLog({
        abi: ABI,
        data: withdraw.data as Hex,
        topics: withdraw.topics as [signature: Hex, ...args: Hex[]] | [],
        eventName: 'MintAndWithdraw',
      })

      return {
        direction: 'receive',
        protocol: CCTPV1.name,
        token: ChainSpecificAddress(
          `${chain.shortName}:${withdrawData.args.mintToken}`,
        ),
        amount: withdrawData.args.amount,
        origin: data.args.sourceDomain.toString(),
        blockNumber: log.blockNumber ?? undefined,
        txHash: log.transactionHash ?? undefined,
        type: 'MessageReceived',
        matchingId: idFor(BigInt(data.args.sourceDomain), data.args.nonce),
      }
    }
  }

  return undefined
}

const ABI = parseAbi([
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)',
  'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)',
  'event MintAndWithdraw(address indexed mintRecipient,uint256 amount,address indexed mintToken)',
])

const BRIDGES = [
  {
    domain: 0n,
    chainShortName: 'eth',
    tokenMessenger: EthereumAddress(
      '0xBd3fa81B58Ba92a82136038B25aDec7066af3155',
    ),
    messageTransmitter: EthereumAddress(
      '0x0a992d191DEeC32aFe36203Ad87D7d289a738F81',
    ),
  },
  {
    domain: 3n,
    chainShortName: 'arb1',
    tokenMessenger: EthereumAddress(
      '0x19330d10D9Cc8751218eaf51E8885D058642E08A',
    ),
    messageTransmitter: EthereumAddress(
      '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca',
    ),
  },
  {
    domain: 2n,
    chainShortName: 'oeth',
    tokenMessenger: EthereumAddress(
      '0x2B4069517957735bE00ceE0fadAE88a26365528f',
    ),
    messageTransmitter: EthereumAddress(
      '0x4D41f22c5a0e5c74090899E5a8Fb597a8842b3e8',
    ),
  },
  {
    domain: 6n,
    chainShortName: 'base',
    tokenMessenger: EthereumAddress(
      '0x1682Ae6375C4E4A97e4B583BC394c861A46D8962',
    ),
    messageTransmitter: EthereumAddress(
      '0xAD09780d193884d503182aD4588450C416D6F9D4',
    ),
  },
  {
    domain: 10n,
    chainShortName: 'unichain',
    tokenMessenger: EthereumAddress(
      '0x4e744b28E787c3aD0e810eD65A24461D4ac5a762',
    ),
    messageTransmitter: EthereumAddress(
      '0x353bE9E2E38AB1D19104534e4edC21c643Df86f4',
    ),
  },
]

const idFor = (domain: bigint, nonce: bigint | string) =>
  `${domain}_${nonce}` as const
