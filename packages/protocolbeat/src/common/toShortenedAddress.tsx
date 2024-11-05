export function toShortenedAddress(input: string) {
  const [chain, address] = input.split(':') as [string, string]
  return `${chain}:${address.slice(0, 6)}…${address.slice(-4)}`
}
