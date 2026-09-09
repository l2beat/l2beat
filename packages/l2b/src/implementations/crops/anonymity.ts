import type { AttestationNetworkConfig } from '@l2beat/config/build/crops/eas'

// While the attestations live on a testnet, nothing published onchain may tie
// them to L2BEAT. The commands run this right before signing.

const FORBIDDEN = ['l2beat', 'crops']

export function findIdentifyingStrings(text: string): string[] {
  const haystack = text.toLowerCase()
  return FORBIDDEN.filter((needle) => haystack.includes(needle))
}

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
