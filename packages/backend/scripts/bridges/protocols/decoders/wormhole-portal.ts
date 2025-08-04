import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeEventLog,
  decodeFunctionResult,
  encodeEventTopics,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'
import { extractAddressFromPadded } from '../../utils/viem'
import { createWormholeSequence } from '../../utils/wormhole'

export const WORMHOLE_PORTAL = {
  name: 'wormhole-portal',
  decoder: decoder,
}

const ABI = parseAbi([
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress, uint64 indexed sequence)',
  'function parseTransfer(bytes memory encoded) public pure returns ((uint8 payloadID,uint256 amount,bytes32 tokenAddress,uint16 tokenChain,bytes32 to,uint16 toChain,uint256 fee) memory transfer)',
  'event Deposit(address indexed dst, uint256 wad)', // WETH
  'event Transfer(address indexed from, address indexed to, uint256 value)', // ERC20
])

async function decoder(
  chain: Chain,
  input: DecoderInput,
  rpc?: RpcClient,
): Promise<Message | Asset | undefined> {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    input.transactionTo === network.tokenBridge &&
    EthereumAddress(input.log.address) === network.coreBridge &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'LogMessagePublished' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'LogMessagePublished',
    })

    const id = createWormholeSequence(
      network.chainId,
      EthereumAddress(data.args.sender),
      data.args.sequence,
    )

    assert(rpc)
    //parseTransferWithPayload not yet supported
    //to support it we would need to check method signature from calldata
    const call = await rpc.call(
      {
        to: network.tokenBridge,
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'parseTransfer',
            args: [data.args.payload],
          }),
        ),
      },
      input.blockNumber,
    )
    const wormholeTransfer = decodeFunctionResult({
      abi: ABI,
      data: call.toString() as Hex,
      functionName: 'parseTransfer',
    })

    const destination = NETWORKS.find(
      (b) => b.chainId === wormholeTransfer.toChain,
    )?.chainShortName

    const depositLog = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'Deposit' })[0],
    )
    if (depositLog) {
      // ETH not yet supported, only transfers I have found we sent to Solana
      return undefined
    }

    const transferLog = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'Transfer' })[0],
    )
    assert(
      transferLog,
      `Outbound Token heuristic failed ${input.transactionHash}`,
    )

    const amount = decodeEventLog({
      abi: ABI,
      data: transferLog.data,
      topics: transferLog.topics,
      eventName: 'Transfer',
    }).args.value

    return {
      type: 'asset',
      direction: 'outbound',
      application: WORMHOLE_PORTAL.name,
      origin: chain.shortName,
      destination: destination ?? wormholeTransfer.toChain.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'LogMessagePublished',
      matchingId: id,
      amount: amount,
      token: transferLog.address,
      // messageProtocol: string,
      // messageId: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.tokenBridge &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'TransferRedeemed' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'TransferRedeemed',
    })

    const id = createWormholeSequence(
      data.args.emitterChainId,
      EthereumAddress(extractAddressFromPadded(data.args.emitterAddress)),
      data.args.sequence,
    )

    const origin = NETWORKS.find(
      (c) => c.chainId === data.args.emitterChainId,
    )?.chainShortName

    const transferLog = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'Transfer' })[0],
    )
    assert(
      transferLog,
      `Inbound Token heuristic failed ${input.transactionHash}`,
    )
    const amount = decodeEventLog({
      abi: ABI,
      data: transferLog.data,
      topics: transferLog.topics,
      eventName: 'Transfer',
    }).args.value

    return {
      type: 'asset',
      direction: 'inbound',
      application: WORMHOLE_PORTAL.name,
      origin: origin ?? data.args.emitterChainId.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'TransferRedeemed',
      matchingId: id,
      amount: amount,
      token: transferLog.address,
      // messageProtocol: string,
      // messageId: string
    }
  }

  return undefined
}

const NETWORKS = [
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
