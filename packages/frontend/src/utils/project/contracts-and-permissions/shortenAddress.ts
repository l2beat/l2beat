/** The name an address goes by when it has none of its own, e.g. 0x1234…abcd. */
export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
