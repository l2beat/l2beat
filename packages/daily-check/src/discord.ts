import type { Status, TileResult } from './evaluate'
import type { SkippedTile } from './tiles'

const DISCORD_MESSAGE_LIMIT = 1900

const EMOJI: Record<Status, string> = {
  green: '🟢',
  amber: '🟡',
  red: '🔴',
  none: '⚪',
}

export function formatSummary(
  dashboardTitle: string,
  timeFrom: string,
  timeTo: string,
  controls: string[],
  results: TileResult[],
  skipped: SkippedTile[],
): string {
  const scope = [`${timeFrom} → ${timeTo}`, ...controls].join(', ')
  const lines = [`**Daily check — ${dashboardTitle}** (${scope})`]

  let section: string | undefined
  for (const result of results) {
    if (result.tile.section !== section) {
      section = result.tile.section
      if (section) {
        lines.push('', `**${section}**`)
      }
    }
    lines.push(formatResult(result))
  }

  if (skipped.length > 0) {
    lines.push('', '**Not checked automatically** (verify manually)')
    for (const tile of skipped) {
      lines.push(`⚪ ${tile.title} — ${tile.reason}`)
    }
  }
  return lines.join('\n')
}

function formatResult(result: TileResult): string {
  const alsoFailing = (result.buckets ?? [])
    .slice(1)
    .filter((bucket) => bucket.status === 'red' || bucket.status === 'amber')
  const suffix =
    alsoFailing.length > 0
      ? ` — also ${alsoFailing
          .map((bucket) => `${bucket.key} (${bucket.value})`)
          .join(', ')}`
      : ''
  const title = stripSectionPrefix(result.tile.title, result.tile.section)
  return `${EMOJI[result.status]} ${title}: ${result.formatted}${suffix}`
}

function stripSectionPrefix(title: string, section: string): string {
  const prefix = `[${section}] `
  return section && title.startsWith(prefix)
    ? title.slice(prefix.length)
    : title
}

/**
 * Sends content to a Discord webhook, splitting it into multiple messages
 * on line boundaries when it exceeds the per-message limit.
 */
export async function postDiscord(
  webhookUrl: string,
  content: string,
): Promise<void> {
  for (const chunk of splitMessage(content, DISCORD_MESSAGE_LIMIT)) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: chunk }),
    })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Discord webhook returned ${response.status}: ${body}`)
    }
    // Stay under the webhook rate limit when sending multiple chunks.
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

export function splitMessage(content: string, limit: number): string[] {
  if (content.length <= limit) {
    return [content]
  }

  const chunks: string[] = []
  let current = ''
  for (let line of content.split('\n')) {
    // A single line longer than the limit is hard-split.
    while (line.length > limit) {
      if (current) {
        chunks.push(current)
        current = ''
      }
      chunks.push(line.slice(0, limit))
      line = line.slice(limit)
    }
    if (current.length + line.length + 1 > limit) {
      chunks.push(current)
      current = ''
    }
    current = current ? `${current}\n${line}` : line
  }
  if (current) {
    chunks.push(current)
  }
  return chunks
}
