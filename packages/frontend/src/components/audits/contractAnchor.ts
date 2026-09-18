/** URL fragment of a deployed contract row, linked from project pages. */
export function contractAnchorId(chain: string, address: string): string {
  return `contract-${chain}-${address}`.toLowerCase()
}
