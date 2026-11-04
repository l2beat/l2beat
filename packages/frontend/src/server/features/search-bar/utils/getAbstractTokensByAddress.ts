import type { EthereumAddress } from '@l2beat/shared-pure'
import { env } from '~/env'
import {
  findInteropAbstractToken,
  type InteropAbstractToken,
} from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { getTokenDb } from '~/server/tokenDb'

/**
 * Abstract tokens deployed at `address` on any chain. Not limited to the
 * active interop tokens, since every abstract token has a page.
 */
export async function getAbstractTokensByAddress(
  address: EthereumAddress,
): Promise<InteropAbstractToken[]> {
  if (env.MOCK) {
    const id = MOCK_TOKEN_IDS_BY_ADDRESS[address.toLowerCase()]
    const token = id && (await findInteropAbstractToken(id))
    return token ? [token] : []
  }

  return getTokenDb().deployedToken.getAbstractTokensByAddress(address)
}

const MOCK_TOKEN_IDS_BY_ADDRESS: Record<string, string | undefined> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usdc01',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'usdt01',
}
