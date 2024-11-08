import 'server-only'

import { type Chain } from 'viem'
import { assert } from '@l2beat/shared-pure'

import * as chains from 'viem/chains'

export function getChain({
  chainId,
  rpcUrl,
}: {
  chainId: number
  rpcUrl: string
}) {
  const chain = Object.values(chains).find((c) => c.id === chainId)
  assert(chain, `Chain ${chainId} not found in Viem`)
  return {
    ...chain,
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
    },
  } satisfies Chain
}
