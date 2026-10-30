import type { AbstractTokenRecord, DeployedTokenRecord } from '@l2beat/database'
import { normalizeInteropTokenAddress } from '../ingestion/tokenIngestionUtils'

export interface TokenRef {
  chain: string
  address: string
}

// The same normalization interop and the token DB ingestion use, so all
// three sources agree on how a deployment is identified.
export function normalizeTokenAddress(address: string): string {
  return normalizeInteropTokenAddress(address) ?? address.toLowerCase()
}

export function tokenKey(token: TokenRef): string {
  return `${token.chain}:${normalizeTokenAddress(token.address)}`
}

export function toTokenRef(chain: string, address: string): TokenRef {
  return { chain, address: normalizeTokenAddress(address) }
}

export interface TokenInfo {
  deployedToken: DeployedTokenRecord | undefined
  abstractToken: AbstractTokenRecord | undefined
}

export class TokenIndex {
  private readonly byKey = new Map<string, TokenInfo>()

  constructor(
    deployedTokens: DeployedTokenRecord[],
    abstractTokens: AbstractTokenRecord[],
  ) {
    const abstractById = new Map(
      abstractTokens.map((token) => [token.id, token]),
    )
    for (const deployedToken of deployedTokens) {
      this.byKey.set(tokenKey(deployedToken), {
        deployedToken,
        abstractToken: deployedToken.abstractTokenId
          ? abstractById.get(deployedToken.abstractTokenId)
          : undefined,
      })
    }
  }

  get(token: TokenRef): TokenInfo {
    return (
      this.byKey.get(tokenKey(token)) ?? {
        deployedToken: undefined,
        abstractToken: undefined,
      }
    )
  }
}
