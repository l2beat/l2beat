// this is only temporary, to be removed when token db tables will be created
import { Generated, Timestamp } from '../generated/types'
import { ExplorerType, ExternalBridgeType } from './enums'

export type BridgeEscrow = {
  id: string
  networkId: string
  address: string
  externalBridgeId: string | null
  canonicalNetworkId: string | null
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}
export type BridgeEscrowToToken = {
  A: string
  B: string
}
export type Cache = {
  key: string
  value: string
  chainId: number
  blockNumber: number | null
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}

export type Deployment = {
  id: string
  tokenId: string
  txHash: string | null
  blockNumber: number | null
  timestamp: Timestamp | null
  from: string | null
  to: string | null
  isDeployerEoa: boolean | null
  sourceAvailable: boolean
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}
export type DiscoveryCache = {
  key: string
  value: string
  block_number: number
  chain: string
}
export type ExternalBridge = {
  id: string
  name: string
  type: ExternalBridgeType
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}

export type Network = {
  id: string
  chainId: number
  name: string
  coingeckoId: string | null
  axelarId: string | null
  axelarGatewayAddress: string | null
  orbitId: string | null
  wormholeId: string | null
  layerZeroV1EndpointAddress: string | null
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}
export type NetworkExplorer = {
  id: string
  networkId: string
  type: ExplorerType
  url: string
  apiKey: string
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}
export type NetworkRpc = {
  id: string
  networkId: string
  url: string
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}

export type Token = {
  id: string
  networkId: string
  address: string
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}
export type TokenBridge = {
  id: string
  sourceTokenId: string
  targetTokenId: string
  externalBridgeId: string | null
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}
export type TokenMeta = {
  id: string
  tokenId: string
  externalId: string | null
  source: string
  name: string | null
  symbol: string | null
  decimals: number | null
  logoUrl: string | null
  contractName: string | null
  updatedAt: Generated<Timestamp>
  createdAt: Generated<Timestamp>
}

export type TokenDB = {
  _BridgeEscrowToToken: BridgeEscrowToToken
  BridgeEscrow: BridgeEscrow
  Cache: Cache
  Deployment: Deployment
  discovery_cache: DiscoveryCache
  ExternalBridge: ExternalBridge
  Network: Network
  NetworkExplorer: NetworkExplorer
  NetworkRpc: NetworkRpc
  Token: Token
  TokenBridge: TokenBridge
  TokenMeta: TokenMeta
}
