import { getEnv } from '@l2beat/backend-tools'
import { type ChainInfo, chains } from './chains'

export interface ChainConfig extends ChainInfo {
  rpcUrl: string | undefined
}

export interface Config {
  port: number
  chains: ChainConfig[]
}

export function getConfig(): Config {
  const env = getEnv()
  return {
    port: env.integer('PORT', 3000),
    chains: chains.map((c) => ({
      ...c,
      rpcUrl: env.optionalString(`${c.name.toUpperCase()}_RPC_URL`),
    })),
  }
}
