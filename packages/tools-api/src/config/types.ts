import { v } from '@l2beat/validate'
import type { UopsChain } from '../modules/uops-module/types'

export type Address = `${string}:0x${string}`

export interface Config {
  port: number
  alchemyApiKey: string
  etherscanApiKey: string
  chains: Chain[]
  discovered: DiscoveredConfig
  tokens: TokenConfig
  wellKnownAbi: Record<string, string[]>
  hashes: Record<`0x${string}`, string>
  uopsChains: UopsChain[]
}

export type Chain = v.infer<typeof Chain>
export const Chain = v.object({
  name: v.string(),
  discoveryName: v.string().optional(),
  shortName: v.string(),
  chainId: v.number(),
  etherscanApi: v.boolean(),
  explorerUrl: v.string(),
  alchemyId: v.string(),
  nativeCurrency: v.object({
    name: v.string(),
    symbol: v.string(),
    decimals: v.number(),
  }),
})

export interface DiscoveredConfig {
  names: Record<Address, string>
  abis: Record<Address, string[]>
  allAbis: string[]
  preImages: string[]
}

export type TokenConfig = Record<Address, TokenInfo>

export interface TokenInfo {
  name: string
  decimals: number
}
