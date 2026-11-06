import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'

/**
 * Generated risk groups with hand-written ones (a merged page's other
 * section) merged in: items under a heading both have go after the generated items, other
 * groups after the generated groups. Numbering runs across all of them.
 */
export function mergeRiskGroups(
  riskGroups: RiskGroup[],
  handWrittenMarkdown: string | undefined,
): RiskGroup[] {
  if (!handWrittenMarkdown) return riskGroups

  const merged = riskGroups.map((group) => ({
    ...group,
    items: [...group.items],
  }))
  for (const { name, items } of parseRiskGroups(handWrittenMarkdown)) {
    const handWritten = items.map((text) => ({ text, isCritical: false }))
    const group = merged.find((group) => group.name === name)
    if (group) group.items.push(...handWritten)
    else merged.push({ start: 0, name, items: handWritten })
  }

  let start = 1
  for (const group of merged) {
    group.start = start
    start += group.items.length
  }
  return merged
}

/** `## Heading` + numbered list markdown, as the privacy risk summaries use. */
function parseRiskGroups(markdown: string) {
  return markdown
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [name = '', ...lines] = block.replace(/<br>/g, '').split('\n')
      const items: string[] = []
      for (const line of lines) {
        const item = line.match(/^\d+\.\s+(.*)/)
        if (item?.[1]) items.push(item[1].trim())
        // A line that wraps the item above
        else if (line.trim() && items.length > 0) {
          items[items.length - 1] += ` ${line.trim()}`
        }
      }
      return { name: name.trim(), items }
    })
}
