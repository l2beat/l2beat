// While the attestations live on a testnet, nothing we publish onchain may tie
// them to L2BEAT. This makes that rule mechanical instead of something to
// remember: it runs over the schema string and over every encoded payload
// immediately before signing.

const FORBIDDEN = ['l2beat', 'crops']

export function findIdentifyingStrings(text: string): string[] {
  const haystack = text.toLowerCase()
  return FORBIDDEN.filter((needle) => haystack.includes(needle))
}

export function assertAnonymous(what: string, text: string): void {
  const found = findIdentifyingStrings(text)
  if (found.length > 0) {
    throw new Error(
      `${what} contains ${found.map((x) => `"${x}"`).join(', ')}, which must not appear onchain while attesting on a testnet. Refusing to sign.`,
    )
  }
}
