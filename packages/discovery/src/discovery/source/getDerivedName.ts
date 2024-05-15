export function getLegacyDerivedName(names: string[]): string {
  return (names.length === 2 ? names[1] : names[0]) ?? ''
}

export function getDerivedName(names: string[]): string | undefined {
  names = names.map((x) => (x === '' ? 'Unknown' : x))
  if (names.length === 0) {
    return 'Unknown'
  } else if (names.length === 1) {
    return names[0]
  } else if (names.length === 2) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    return `${names[1]!} (${names[0]!})`
  } else {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    return `${names[0]!} (${names.length - 1} implementations)`
  }
}
