import { EthereumAddress } from '@l2beat/shared-pure'
import { type Hex, type Log, decodeAbiParameters, decodeEventLog, encodeEventTopics, parseAbi, parseAbiParameters } from 'viem'
import type { BridgeTransfer } from '../../types/BridgeTransfer'

export const LAYER_ZERO = {
  name: 'layer_zero',
  decoder: decoder,
}

function decoder(chainName: string, log: Log): BridgeTransfer | undefined {
  const chain = CHAINS.find((c) => c.name === chainName)

  if (!chain || EthereumAddress(log.address) !== chain.endpoint) {
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

    const decodedPacket = decodePacket(data.args.encodedPayload)

    console.log(decodedPacket)

    const destination = CHAINS.find(
      (c) => c.eid === decodedPacket.packetHeader.dstEid,
    )?.name

    // 1. get all events from this tx
    // for every OFTSent
    //  - get amount etc.
    //  - get address of emitter -> call token() for underlying token -> call symbol()

    return {
      protocol: LAYER_ZERO.name,
      chain: chainName,
      origin: chain.name,
      destination: destination ?? decodedPacket.packetHeader.dstEid.toString(),
      token: 'token',
      amount: '0',
      sender: 'sender',
      receiver: 'receiver',
      txHash: log.transactionHash ?? undefined,
      type: 'PacketSent',
      matchingId: undefined,
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
])



const CHAINS = [
  {
    eid: 30101,
    name: 'ethereum',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30110,
    name: 'arbitrum',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30184,
    name: 'base',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30184,
    name: 'base',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30183,
    name: 'linea',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30111,
    name: 'optimism',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30175,
    name: 'nova',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30165,
    name: 'zksync2',
    endpoint: EthereumAddress('0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF'),
  },
  {
    eid: 30243,
    name: 'blast',
    endpoint: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    eid: 30320,
    name: 'unichain',
    endpoint: EthereumAddress('0x6F475642a6e85809B1c36Fa62763669b1b48DD5B'),
  },
]

function decodePacket(encodedData: string) {
  const data = encodedData.startsWith('0x') ? encodedData.slice(2) : encodedData
  
  const packetVersion = parseInt(data.slice(0, 2), 16)
  
  const nonce = BigInt('0x' + data.slice(2, 18))
  
  const srcEid = parseInt(data.slice(18, 26), 16)
  
  const senderBytes32 = '0x' + data.slice(26, 90)
  const sender = '0x' + senderBytes32.slice(-40)
  
  const dstEid = parseInt(data.slice(90, 98), 16)
  
  const receiver = '0x' + data.slice(98, 138)
  
  const payload = '0x' + data.slice(138)
  
  let decodedPayload
  try {
    decodedPayload = decodeAbiParameters(
      parseAbiParameters('bytes32, address, uint256'),
      payload as Hex
    )
  } catch  {
    decodedPayload = { raw: payload }
  }
  
  return {
    packetHeader: {
      packetVersion,
      nonce,
      srcEid,
      sender,
      dstEid,
      receiver
    },
    payload: decodedPayload
  }
}