// NOTE(radomski): This file contains functions used to gently get us to a
// point where we always operate on chain-specific addresses. We don't want to
// change the internals of discovery yet, only the output.
//
// Once the internals operate on chain-specific addresses, we can remove this
// file.

import { type ChainSpecificAddress, fromParts } from '@l2beat/shared-pure'

export function migrateImplementationNames(
  implementationNames: Record<string, string> | undefined,
  shortChainName: string,
): Record<ChainSpecificAddress, string> | undefined {
  if (implementationNames === undefined) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(implementationNames).map(([address, name]) => [
      fromParts(shortChainName, address),
      name,
    ]),
  )
}
