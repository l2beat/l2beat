import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Message } from '../../types/Message'
import type { TransactionWithLogs } from '../../types/TransactionWithLogs'
import { extractAddressFromPadded } from '../../utils/viem'
import {
  createWormholeSequence as createWormholeId,
  decodeWormholeTransfer,
} from '../../utils/wormhole'

export const WORMHOLE = {
  name: 'wormhole',
  decoder: decoder,
}

const ABI = parseAbi([
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress, uint64 indexed sequence)',
])

function decoder(
  chain: Chain,
  transaction: TransactionWithLogs,
): Message | undefined {
  for (const log of transaction.logs) {
    const bridge = BRIDGES.find((b) => b.chainShortName === chain.shortName)

    if (!bridge) continue

    if (
      EthereumAddress(log.address) === bridge.coreBridge &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'LogMessagePublished' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'LogMessagePublished',
      })

      const id = createWormholeId(
        bridge.chainId,
        EthereumAddress(data.args.sender),
        data.args.sequence,
      )

      const destinationChainId = decodeWormholeTransfer(
        data.args.payload,
      ).toChain
      const destination = BRIDGES.find(
        (b) => b.chainId === destinationChainId,
      )?.chainShortName

      return {
        direction: 'outbound',
        protocol: WORMHOLE.name,
        origin: chain.shortName,
        destination: destination ?? destinationChainId.toString(),
        blockTimestamp: transaction.blockTimestamp,
        blockNumber: transaction.blockNumber,
        txHash: transaction.hash,
        type: 'LogMessagePublished',
        matchingId: id,
      }
    }

    if (
      EthereumAddress(log.address) === bridge.tokenBridge &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'TransferRedeemed' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'TransferRedeemed',
      })

      const id = createWormholeId(
        data.args.emitterChainId,
        EthereumAddress(extractAddressFromPadded(data.args.emitterAddress)),
        data.args.sequence,
      )

      const origin = BRIDGES.find(
        (c) => c.chainId === data.args.emitterChainId,
      )?.chainShortName

      return {
        direction: 'inbound',
        protocol: WORMHOLE.name,
        origin: origin ?? data.args.emitterChainId.toString(),
        destination: chain.shortName,
        blockTimestamp: transaction.blockTimestamp,
        blockNumber: transaction.blockNumber,
        txHash: transaction.hash,
        type: 'TransferRedeemed',
        matchingId: id,
      }
    }
  }

  return undefined
}

const BRIDGES = [
  {
    chainId: 2,
    chainShortName: 'eth',
    coreBridge: EthereumAddress('0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B'),
    tokenBridge: EthereumAddress('0x3ee18B2214AFF97000D974cf647E7C347E8fa585'),
  },
  {
    chainId: 23,
    chainShortName: 'arb1',
    coreBridge: EthereumAddress('0xa5f208e072434bC67592E4C49C1B991BA79BCA46'),
    tokenBridge: EthereumAddress('0x0b2402144Bb366A632D14B83F244D2e0e21bD39c'),
  },
  {
    chainId: 30,
    chainShortName: 'base',
    coreBridge: EthereumAddress('0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6'),
    tokenBridge: EthereumAddress('0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627'),
  },
]
