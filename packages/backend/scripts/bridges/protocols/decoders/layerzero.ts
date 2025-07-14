import type { RpcClient } from '@l2beat/shared'
import {
  assert,
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import {
  decodeAbiParameters,
  decodeEventLog,
  encodeEventTopics,
  type Hex,
  type Log,
  parseAbi,
  parseAbiParameters,
} from 'viem'
import type { Chain } from '../../chains'
import type { Receive } from '../../types/Receive'
import type { Send } from '../../types/Send'
import { extractAddressFromPadded } from '../../utils/viem'

export const LAYER_ZERO = {
  name: 'layerzero',
  decoder: decoder,
}

async function decoder(
  chain: Chain & { rpc: RpcClient },
  log: Log,
): Promise<Send | Receive | undefined> {
  const endpoint = ENDPOINTS.find((e) => e.shortChainName === chain.shortName)

  if (!endpoint || EthereumAddress(log.address) !== endpoint.address) {
    return undefined
  }

  if (
    log.topics[0] ===
    encodeEventTopics({ abi: ABI, eventName: 'PacketSent' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
      eventName: 'PacketSent',
    })

    assert(log.transactionHash)
    const events = await chain.rpc.getTransactionReceipt(log.transactionHash)

    const oftSent = events.logs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'OFTSent' })[0],
    )

    if (!oftSent) return undefined

    const oftData = decodeEventLog({
      abi: ABI,
      data: oftSent.data as Hex,
      topics: oftSent.topics as [signature: Hex, ...args: Hex[]] | [],
      eventName: 'OFTSent',
    })

    assert(log.blockNumber)

    const token = await chain.rpc.call(
      {
        to: EthereumAddress(oftSent.address),
        data: Bytes.fromHex('0xfc0c546a'),
      },
      Number(log.blockNumber),
    )

    const decodedPacket = decodePacket(data.args.encodedPayload)

    const destination = ENDPOINTS.find(
      (c) => c.eid === decodedPacket.packetHeader.dstEid,
    )?.shortChainName

    return {
      direction: 'send',
      protocol: LAYER_ZERO.name,
      token: ChainSpecificAddress(
        `${chain.shortName}:${extractAddressFromPadded(token.toString() as Hex)}`,
      ),
      amount: oftData.args.amountSentLD,
      destination: destination ?? decodedPacket.packetHeader.dstEid.toString(),
      blockNumber: log.blockNumber,
      txHash: log.transactionHash ?? undefined,
      type: 'OFTSent',
      matchingId: oftData.args.guid,
    }
  }

  // if (
  //   log.topics[0] ===
  //   encodeEventTopics({ abi: ABI, eventName: 'PacketDelivered' })[0]
  // ) {
  //   const data = decodeEventLog({
  //     abi: ABI,
  //     data: log.data,
  //     topics: log.topics,
  //     eventName: 'PacketDelivered',
  //   })

  //   console.log(data)

  //   const origin = CHAINS.find(
  //     (c) => c.eid === data.args.origin.srcEid,
  //   )?.name

  //   return {
  //     protocol: LAYER_ZERO.name,
  //     chain: chainName,
  //     origin: origin ?? data.args.origin.srcEid.toString(),
  //     destination: chain.name,
  //     token: 'token',
  //     amount: '0',
  //     sender: 'sender',
  //     receiver: 'receiver',
  //     txHash: log.transactionHash ?? undefined,
  //     type: 'PacketDelivered',
  //     matchingId: undefined,
  //   }
  // }

  return undefined
}

const ABI = parseAbi([
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
  'event PacketDelivered((uint32 srcEid, bytes32 sender, uint64 nonce) origin, address receiver)',
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
])

const ENDPOINTS = [
  {
    eid: 30101,
    shortChainName: 'eth',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30110,
    shortChainName: 'arb1',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30184,
    shortChainName: 'base',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30183,
    shortChainName: 'linea',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30111,
    shortChainName: 'oeth',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30175,
    shortChainName: 'arb-nova',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30165,
    shortChainName: 'zksync',
    address: EthereumAddress('0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF'),
  },
  {
    eid: 30243,
    shortChainName: 'blastmainnet',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30320,
    shortChainName: 'unichain',
    address: EthereumAddress('0x6F475642a6e85809B1c36Fa62763669b1b48DD5B'),
  },
]

function decodePacket(encodedData: string) {
  const data = encodedData.startsWith('0x') ? encodedData.slice(2) : encodedData

  const packetVersion = Number.parseInt(data.slice(0, 2), 16)

  const nonce = BigInt('0x' + data.slice(2, 18))

  const srcEid = Number.parseInt(data.slice(18, 26), 16)

  const senderBytes32 = '0x' + data.slice(26, 90)
  const sender = '0x' + senderBytes32.slice(-40)

  const dstEid = Number.parseInt(data.slice(90, 98), 16)

  const receiver = '0x' + data.slice(98, 138)

  const payload = '0x' + data.slice(138)

  let decodedPayload
  try {
    decodedPayload = decodeAbiParameters(
      parseAbiParameters('bytes32, address, uint256'),
      payload as Hex,
    )
  } catch {
    decodedPayload = { raw: payload }
  }

  return {
    packetHeader: {
      packetVersion,
      nonce,
      srcEid,
      sender,
      dstEid,
      receiver,
    },
    payload: decodedPayload,
  }
}
