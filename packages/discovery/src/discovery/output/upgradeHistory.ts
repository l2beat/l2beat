export interface Upgrade {
  timestamp: number
  transaction?: string
}

export function parsePastUpgrades(value: unknown): Upgrade[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const upgrades: Upgrade[] = []
  for (const item of value) {
    const upgrade = parseUpgrade(item)
    if (upgrade === undefined) continue
    if (upgrade.transaction !== undefined) {
      if (seen.has(upgrade.transaction)) continue
      seen.add(upgrade.transaction)
    }
    upgrades.push(upgrade)
  }
  return upgrades.sort((a, b) => a.timestamp - b.timestamp)
}

export function parseUpgrade(item: unknown): Upgrade | undefined {
  if (!Array.isArray(item) || typeof item[0] !== 'string') return undefined
  const parsed = Date.parse(item[0])
  if (!Number.isFinite(parsed)) return undefined
  const timestamp = Math.floor(parsed / 1000)
  if (typeof item[1] === 'string' && item[1] !== '') {
    return { timestamp, transaction: item[1].toLowerCase() }
  }
  return { timestamp }
}
