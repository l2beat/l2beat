import { z } from 'zod'

export type Address = `${string}:0x${string}`

export interface Config {
  port: number
  alchemyApiKey: string
  etherscanApiKey: string
  chains: Chain[]
  discovered: DiscoveredConfig
  tokens: TokenConfig
  wellKnownAbi: Record<string, string[]>
}

export type Chain = z.infer<typeof Chain>
export const Chain = z.object({
  name: z.string(),
  discoveryName: z.string().optional(),
  shortName: z.string(),
  chainId: z.number(),
  etherscanApi: z.boolean(),
  explorerUrl: z.string(),
  alchemyId: z.string(),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
})

export interface DiscoveredConfig {
  names: Record<Address, string>
  abis: Record<Address, string[]>
  allAbis: string[]
}

export type TokenConfig = Record<Address, TokenInfo>

export interface TokenInfo {
  name: string
  decimals: number
}
