import type { Sentiment } from '@l2beat/config'

/** Separates blocks with a blank line and drops empty ones, so an optional part is just '' when absent. */
export function joinBlocks(blocks: string[]) {
  return blocks.filter((block) => block !== '').join('\n\n')
}

export function heading(level: number, text: string) {
  return `${'#'.repeat(level)} ${text}`
}

/** A heading only makes sense above content, so an empty body drops both. */
export function subsection(
  level: number,
  title: string,
  body: string | undefined,
) {
  return body ? joinBlocks([heading(level, title), body]) : ''
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

/** Same marker placement as the HTML risk lists: before the closing punctuation. */
export function markCritical(text: string, isCritical: boolean | undefined) {
  return isCritical ? `${text.slice(0, -1)} (CRITICAL)${text.slice(-1)}` : text
}

/**
 * Config text can carry its own headings (e.g. "## Architecture"). Shifted so
 * the shallowest one lands at `level`, they nest under the heading the text is
 * rendered below instead of breaking the page outline.
 */
export function nestHeadings(content: string, level: number) {
  const lines = content.split('\n')
  const headingDepths = findHeadingDepths(lines)
  if (headingDepths.size === 0) return content

  const shift = level - Math.min(...headingDepths.values())
  if (shift <= 0) return content

  return lines
    .map((line, i) => {
      const depth = headingDepths.get(i)
      if (depth === undefined) return line
      const nestedDepth = Math.min(depth + shift, MAX_HEADING_DEPTH)
      return `${'#'.repeat(nestedDepth)}${line.slice(depth)}`
    })
    .join('\n')
}

const MAX_HEADING_DEPTH = 6

/** Line index to depth of each ATX heading, skipping fenced code where `#` is literal. */
function findHeadingDepths(lines: string[]) {
  const depths = new Map<number, number>()
  let inCodeFence = false
  for (const [i, line] of lines.entries()) {
    if (line.trimStart().startsWith('```')) {
      inCodeFence = !inCodeFence
      continue
    }
    const hashes = line.match(/^(#{1,6}) /)?.[1]
    if (!inCodeFence && hashes) {
      depths.set(i, hashes.length)
    }
  }
  return depths
}
