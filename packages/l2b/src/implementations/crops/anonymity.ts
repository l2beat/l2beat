import type { AttestationNetworkConfig } from '@l2beat/config/build/crops/eas'

// While the attestations live on a testnet, nothing we publish onchain may tie
// them to L2BEAT. This makes that rule mechanical instead of something to
// remember: the commands run it over the schema string and over the attested
// set immediately before signing, and it is a no-op on mainnet.

const FORBIDDEN = ['l2beat', 'crops']

export function findIdentifyingStrings(text: string): string[] {
  const haystack = text.toLowerCase()
  return FORBIDDEN.filter((needle) => haystack.includes(needle))
}

/**
 * Checks what actually lands onchain - the schema and the string values, not
 * the hex blob they encode to - and only where the rule applies.
 */
export function assertAnonymous(
  network: AttestationNetworkConfig,
  what: string,
  text: string,
): void {
  if (!network.isTestnet) {
    return
  }
  const found = findIdentifyingStrings(text)
  if (found.length > 0) {
    throw new Error(
      `${what} contains ${found.map((x) => `"${x}"`).join(', ')}, which must not appear onchain while attesting on ${network.name}. Refusing to sign.`,
    )
  }
}
