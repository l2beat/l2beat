import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'

/**
 * A page's risk groups with another page's merged in: items under a heading
 * both have go after the page's own, other groups after the page's own groups.
 * Numbering runs across all of them.
 */
export function mergeRiskGroups(
  riskGroups: RiskGroup[],
  others: Omit<RiskGroup, 'start'>[],
): RiskGroup[] {
  const merged = riskGroups.map((group) => ({
    ...group,
    items: [...group.items],
  }))
  for (const other of others) {
    const group = merged.find((group) => group.name === other.name)
    if (group) group.items.push(...other.items)
    else merged.push({ start: 0, ...other })
  }

  let start = 1
  for (const group of merged) {
    group.start = start
    start += group.items.length
  }
  return merged
}
