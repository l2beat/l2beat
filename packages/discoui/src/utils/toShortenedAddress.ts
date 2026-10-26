export function toShortenedAddress(input: string) {
  const separator = input.indexOf(':')
  const chain = separator === -1 ? undefined : input.slice(0, separator)
  const address = separator === -1 ? input : input.slice(separator + 1)
  const shortened = `${address.slice(0, 6)}…${address.slice(-4)}`

  return chain === undefined ? shortened : `${chain}:${shortened}`
}
