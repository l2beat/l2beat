import type { UpdatesSectionProps } from '~/components/projects/sections/UpdatesSection'
import type { ProjectDiscoveryUpdateSummary } from '~/components/projects/sections/updatesPaging'
import { configMarkdown } from './configMarkdown'
import { heading, joinBlocks, link } from './markdown'
import { formatUtcDateTime } from './renderSectionParts'

/**
 * The changelog as the HTML update cards show it, newest first. The contract
 * diffs load in the browser when a card opens, so each update links its own
 * view of the HTML page instead.
 */
export function renderUpdatesSection(
  { updates }: Pick<UpdatesSectionProps, 'updates'>,
  level: number,
) {
  if (updates.length === 0) return 'No updates.'
  return joinBlocks([
    'Each date links the update on the HTML page, which also shows its contract diffs.',
    ...updates.map((update) => renderUpdate(update, level)),
  ])
}

/** A heading per update, so headings inside a description nest under their update. */
function renderUpdate(update: ProjectDiscoveryUpdateSummary, level: number) {
  const date =
    update.timestamp === null
      ? update.date
      : formatUtcDateTime(update.timestamp)
  const facts = [
    update.isHighSeverity && 'high severity',
    `${update.changeCount} ${update.changeCount === 1 ? 'change' : 'changes'}`,
  ].filter(Boolean)
  const url = `?update=${encodeURIComponent(update.id)}`
  return joinBlocks([
    heading(level, `${link(date, url)} (${facts.join(', ')})`),
    configMarkdown(update.description.trim(), level + 1),
  ])
}
