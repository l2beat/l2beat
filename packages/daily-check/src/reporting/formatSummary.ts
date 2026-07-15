import type { SkippedTile } from '../dashboard/types'
import type { TileResult } from '../evaluation/types'

const EMOJI: Record<TileResult['status'], string> = {
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
