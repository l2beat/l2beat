import type { Sentiment } from '@l2beat/config'

/** Blocks are separated by a blank line; empty blocks are dropped so optional parts need no special casing. */
export function joinBlocks(blocks: string[]) {
  return blocks.filter((block) => block !== '').join('\n\n')
}

export function heading(level: number, text: string) {
  return `${'#'.repeat(level)} ${text}`
}

export function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

export function numberedList(items: string[], start = 1) {
  return items.map((item, i) => `${start + i}. ${item}`).join('\n')
}

export function link(name: string, url: string) {
  return `[${name}](${url})`
}

export function warning(text: string) {
  return `**Warning:** ${text}`
}

export function withSentiment(value: string, sentiment: Sentiment | undefined) {
  return sentiment ? `${value} (sentiment: ${sentiment})` : value
}

/**
 * Config text can carry its own headings (e.g. "## Architecture"). Shifted so
 * the shallowest one lands at `level`, they nest under the heading the text is
 * rendered below instead of breaking the page outline.
 */
export function nestHeadings(content: string, level: number) {
  const lines = content.split('\n')
  const headingLines = findHeadingLines(lines)
  if (headingLines.size === 0) return content

  const depths = [...headingLines].map(
    (i) => lines[i]?.match(/^#+/)?.[0].length ?? level,
  )
  const shift = level - Math.min(...depths)
  if (shift <= 0) return content

  return lines
    .map((line, i) =>
      headingLines.has(i) ? `${'#'.repeat(shift)}${line}` : line,
    )
    .join('\n')
}

/** Indexes of ATX heading lines, skipping fenced code blocks where `#` is literal. */
function findHeadingLines(lines: string[]) {
  const headingLines = new Set<number>()
  let inCodeFence = false
  for (const [i, line] of lines.entries()) {
    if (line.trimStart().startsWith('```')) {
      inCodeFence = !inCodeFence
    } else if (!inCodeFence && /^#{1,6} /.test(line)) {
      headingLines.add(i)
    }
  }
  return headingLines
}

/** Same marker placement as the HTML risk lists: before the closing punctuation. */
export function markCritical(text: string, isCritical: boolean | undefined) {
  return isCritical ? `${text.slice(0, -1)} (CRITICAL)${text.slice(-1)}` : text
}
