import { EthereumAddress } from '@l2beat/shared-pure'
import { createEventParser, type LogToCapture } from '../types'

interface LayerZeroDecodedPacket {
  header: {
    version: number
    nonce: bigint
    srcEid: number
    sender: string
    dstEid: number
    receiver: string
  }
  payload: string
}

export interface LayerZeroAppClassifierInput {
  capture: LogToCapture
  guid: string
  packet: LayerZeroDecodedPacket
}

interface LayerZeroAppClassifier {
  app: string
  classify(input: LayerZeroAppClassifierInput): boolean
}

const classifiers: LayerZeroAppClassifier[] = [
  {
    app: 'aori-settlement',
    classify: isAoriSettlement,
  },
  {
    app: 'superform',
    classify: isSuperform,
  },
  {
    app: 'centrifuge',
    classify: isCentrifuge,
  },
]

export function classifyLayerZeroApp(input: LayerZeroAppClassifierInput) {
  return classifiers.find((classifier) => classifier.classify(input))?.app
}

// https://docs.aori.io/protocol/deployments
// chainconfeeg
const AORI_NETWORKS = [
  {
    chain: 'ethereum',
    address: EthereumAddress('0x0736bdc975af0675b9a045384efed91360d25479'),
  },
  {
    chain: 'arbitrum',
    address: EthereumAddress('0xc6868edf1d2a7a8b759856cb8afa333210dfeda6'),
  },
  {
    chain: 'base',
    address: EthereumAddress('0xc6868edf1d2a7a8b759856cb8afa333210dfeda6'),
  },
  {
    chain: 'optimism',
    address: EthereumAddress('0xc6868edf1d2a7a8b759856cb8afa333210dfeda6'),
  },
  {
    chain: 'bsc',
    address: EthereumAddress('0xFfe691A6dDb5D2645321e0a920C2e7Bdd00dD3D8'),
  },
  {
    chain: 'monad',
    address: EthereumAddress('0xFfe691A6dDb5D2645321e0a920C2e7Bdd00dD3D8'),
  },
  {
    chain: 'megaeth',
    address: EthereumAddress('0xFfe691A6dDb5D2645321e0a920C2e7Bdd00dD3D8'),
  },
] as const

const parseAoriSettleSent = createEventParser(
  'event SettleSent(uint32 indexed srcEid, address indexed filler, bytes payload, bytes32 guid, uint64 nonce, uint256 fee)',
)

function isAoriSettlement(input: LayerZeroAppClassifierInput) {
  const network = AORI_NETWORKS.find((network) => {
    return network.chain === input.capture.chain
  })
  if (!network) return false

  return input.capture.txLogs.some((log) => {
    const settleSent = parseAoriSettleSent(log, [network.address])
    return settleSent?.guid === input.guid
  })
}

const SUPERFORM_ADDRESS = EthereumAddress(
  '0xa195608C2306A26f727d5199D5A382a4508308DA',
)

// https://docs.superform.xyz/deployment-addresses#deployment-addresses
// chainconfeeg
const SUPERFORM_CHAINS = new Set([
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygonpos',
  'bsc',
  'avalanche',
  'unichain',
  'hyperevm',
])

const parseSuperformCrosschainActions = [
  createEventParser(
    'event CrossChainInitiatedDepositMulti(uint256 indexed payloadId, uint64 indexed dstChainId, uint256[] superformIds, uint256[] amountsIn, uint8[] bridgeIds, uint8[] ambIds)',
  ),
  createEventParser(
    'event CrossChainInitiatedDepositSingle(uint256 indexed payloadId, uint64 indexed dstChainId, uint256 superformIds, uint256 amountIn, uint8 bridgeId, uint8[] ambIds)',
  ),
  createEventParser(
    'event CrossChainInitiatedWithdrawMulti(uint256 indexed payloadId, uint64 indexed dstChainId, uint256[] superformIds, uint8[] ambIds)',
  ),
  createEventParser(
    'event CrossChainInitiatedWithdrawSingle(uint256 indexed payloadId, uint64 indexed dstChainId, uint256 superformIds, uint8[] ambIds)',
  ),
] as const

function isSuperform(input: LayerZeroAppClassifierInput) {
  if (!SUPERFORM_CHAINS.has(input.capture.chain)) return false

  return input.capture.txLogs.some((log) => {
    return parseSuperformCrosschainActions.some(
      (parse) => parse(log, [SUPERFORM_ADDRESS]) !== undefined,
    )
  })
}

// https://docs.centrifuge.io/developer/protocol/deployments/
// chainconfeeg
const CENTRIFUGE_LAYERZERO_ADAPTER_ADDRESS = EthereumAddress(
  '0xD517BC7ba17271a8D87BE7355B2523bF5c750295',
)

const CENTRIFUGE_CHAINS = new Set([
  'ethereum',
  'base',
  'arbitrum',
  'plumenetwork',
  'avalanche',
  'bsc',
  'optimism',
  'hyperevm',
  'monad',
  'pharos',
])

function isCentrifuge(input: LayerZeroAppClassifierInput) {
  return (
    CENTRIFUGE_CHAINS.has(input.capture.chain) &&
    getPacketSender(input.packet) ===
      CENTRIFUGE_LAYERZERO_ADAPTER_ADDRESS.toLowerCase()
  )
}

function getPacketSender(packet: LayerZeroDecodedPacket) {
  return `0x${packet.header.sender.slice(-40).toLowerCase()}`
}
