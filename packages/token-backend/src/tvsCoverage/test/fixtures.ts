import type { Formula, TvsToken } from '@l2beat/config'
import type {
  AbstractTokenRecord,
  AggregatedInteropDeployedTokenStats,
  DeployedTokenRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import type { InteropTransferPluginMatcher } from '@l2beat/shared'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'

export const NOW = UnixTime(1_000_000)
export const L1_USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
export const ARB_USDC_E = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
export const ARB_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
export const ESCROW = '0x1111111111111111111111111111111111111111'
export const OP_USDC_E = '0x7f5c764cbc14f9669b88837ca1490cca17c31607'
export const BASE_USDBC = '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca'

export function plugin(
  name: string,
  chain?: string,
): InteropTransferPluginMatcher {
  return { plugin: name, bridgeType: 'lockAndMint', chain }
}

export function stat(input: {
  id: string
  tokenChain: string
  address: string
  bridgeType?: AggregatedInteropDeployedTokenStats['bridgeType']
  volume?: number
  lastSeen?: number
}): AggregatedInteropDeployedTokenStats {
  return {
    id: input.id,
    bridgeType: input.bridgeType ?? 'lockAndMint',
    srcChain: 'ethereum',
    dstChain: input.tokenChain,
    tokenChain: input.tokenChain,
    tokenAddress: input.address,
    volume: input.volume ?? 1,
    transferCount: 1,
    lastSeen: UnixTime(input.lastSeen ?? 1),
  }
}

export function relation(
  locked: [string, string],
  minted: [string, string],
  plugin: string,
): TokenRelationRoute {
  return {
    tokenAChain: locked[0],
    tokenAAddress: locked[1],
    tokenBChain: minted[0],
    tokenBAddress: minted[1],
    plugin,
    bridgeType: 'lockAndMint',
    lockedToken: 'A',
  } as TokenRelationRoute
}

export function escrow(
  chain: string,
  address: string,
  options: { since?: number; escrowAddress?: string } = {},
): Extract<Formula, { type: 'balanceOfEscrow' }> {
  return {
    type: 'balanceOfEscrow',
    chain,
    address: address === 'native' ? 'native' : EthereumAddress(address),
    escrowAddress: EthereumAddress(options.escrowAddress ?? ESCROW),
    decimals: 18,
    sinceTimestamp: UnixTime(options.since ?? 1),
  }
}

export function supply(
  chain: string,
  address: string,
  options: { since?: number; until?: number } = {},
): Extract<Formula, { type: 'totalSupply' }> {
  return {
    type: 'totalSupply',
    chain,
    address: EthereumAddress(address),
    decimals: 18,
    sinceTimestamp: UnixTime(options.since ?? 1),
    untilTimestamp:
      options.until === undefined ? undefined : UnixTime(options.until),
  }
}

export function token(amount: Formula): TvsToken {
  return {
    mode: 'auto',
    id: TokenId('token'),
    priceId: 'token',
    symbol: 'TOKEN',
    name: 'Token',
    amount,
    category: 'other',
    source: 'canonical',
    isAssociated: false,
  } as TvsToken
}

export function abstractToken(
  id: string,
  coingeckoId: string,
): AbstractTokenRecord {
  return {
    id,
    symbol: id.split('.')[1] ?? id,
    issuer: id.split('.')[0] ?? null,
    category: null,
    iconUrl: null,
    coingeckoId,
    coingeckoListingTimestamp: null,
    additionalCoingeckoEntries: null,
    comment: null,
    reviewed: true,
    isPriceUnreliable: false,
  }
}

export function deployedToken(
  chain: string,
  address: string,
  abstractTokenId: string,
): DeployedTokenRecord {
  return {
    chain,
    address,
    abstractTokenId,
    symbol: 'USDC',
    decimals: 6,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    ignored: false,
    metadata: null,
  }
}
