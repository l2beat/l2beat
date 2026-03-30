import type { AbstractTokenRecord } from '@l2beat/database'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'

export type TokenMap = Map<ChainSpecificAddress, AbstractTokenRecord>

export async function buildTokenMap(tokenDb: TokenDbClient): Promise<TokenMap> {
  const result = new Map<ChainSpecificAddress, AbstractTokenRecord>()

  let resp
  try {
    resp = await tokenDb.abstractTokens.getAllWithDeployedTokens.query()
  } catch (error) {
    throw new Error('Token DB unavailable for matching', { cause: error })
  }

  for (const { deployedTokens, ...abstractToken } of resp.abstractTokens) {
    for (const deployedToken of deployedTokens) {
      let chainSpecificAddr: ChainSpecificAddress
      try {
        chainSpecificAddr = ChainSpecificAddress.fromLong(
          deployedToken.chain,
          deployedToken.address,
        )
      } catch {
        // ignore deployed address that we can't construct as ChainSpecificAddress
        // (this can happen because of unsupported chain name or address being e.g. 'native')
        continue
      }
      result.set(chainSpecificAddr, abstractToken)
    }
  }

  return result
}
