export function parseUpgradeTimestamps(value: unknown): number[] {
  if (!Array.isArray(value)) return []

  const seenTransactions = new Set<string>()
  const timestamps: number[] = []
  for (const upgrade of value) {
    if (!Array.isArray(upgrade) || typeof upgrade[0] !== 'string') continue

    const timestamp = Date.parse(upgrade[0])
    if (!Number.isFinite(timestamp)) continue

    const transaction =
      typeof upgrade[1] === 'string' && upgrade[1] !== ''
        ? upgrade[1].toLowerCase()
        : undefined
    if (transaction !== undefined) {
      if (seenTransactions.has(transaction)) continue
      seenTransactions.add(transaction)
    }

    timestamps.push(Math.floor(timestamp / 1000))
  }
  return timestamps.sort((a, b) => a - b)
}

/** Historical entries predate transaction-aware storage. Equal timestamps are
 * indistinguishable there and represent one onchain transaction in practice. */
export function deduplicateUpgradeTimestamps(timestamps: number[]): number[] {
  return [...new Set(timestamps)].sort((a, b) => a - b)
}
