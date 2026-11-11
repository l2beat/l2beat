import type { Sentiment } from '@l2beat/config'
import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import {
  COMPARED_TO_PERIOD,
  formatPercent,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'
import { configMarkdown } from './configMarkdown'

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

/** For config text, whose own headings must nest under the subsection heading. */
export function textSubsection(
  level: number,
  title: string,
  text: string | undefined,
) {
  return subsection(level, title, configMarkdown(text, level + 1))
}

export function bulletList(items: string[]) {
  return items.map((item) => listItem('- ', item)).join('\n')
}

export function numberedList(items: string[], start = 1) {
  return items.map((item, i) => listItem(`${start + i}. `, item)).join('\n')
}

/** Continuation lines align with the item text; unindented, a second paragraph would end the list. */
function listItem(marker: string, text: string) {
  const indent = ' '.repeat(marker.length)
  return `${marker}${text.replaceAll(/\n(?=[^\n])/g, `\n${indent}`)}`
}

export function table(header: string[], rows: string[][]) {
  const line = (cells: string[]) => `| ${cells.map(tableCell).join(' | ')} |`
  return [line(header), line(header.map(() => '---')), ...rows.map(line)].join(
    '\n',
  )
}

/** A pipe would start a new column and a line break a new row. */
function tableCell(text: string) {
  return text.replaceAll('|', '\\|').replaceAll(/\s*\n\s*/g, ' ')
}

export function link(name: string, url: string) {
  return `[${name}](${url})`
}

export function warning(text: string) {
  return `**Warning:** ${text}`
}

export function note(text: string) {
  return `**Note:** ${text}`
}

/** What the HTML shows in place of a value it has no data for. */
export const NO_DATA = 'No data'

export function withSentiment(value: string, sentiment: Sentiment | undefined) {
  return sentiment ? `${value} (${sentimentNote(sentiment)})` : value
}

/** The HTML shows the sentiment as a color, which plain text has to name. */
export function sentimentNote(sentiment: Sentiment) {
  return `sentiment: ${sentiment}`
}

/** The percentage change as the HTML shows it, with the tooltip's period spelled out. */
export function formatChange(change: number, period: PercentageChangePeriod) {
  return `${formatSignedPercent(change)} compared to ${COMPARED_TO_PERIOD[period]}`
}

/**
 * The HTML shows the direction as an arrow next to the unsigned percentage.
 * The sign is picked after rounding, so a change too small to show reads
 * "0.00%" rather than "-0.00%", and the ">1K%" cap is spelled out.
 */
function formatSignedPercent(change: number) {
  const percent = formatPercent(Math.abs(change))
  const roundsToZero = Number.parseFloat(percent) === 0
  const sign = roundsToZero ? '' : change > 0 ? '+' : '-'
  return percent.startsWith('>')
    ? `more than ${sign}${percent.slice(1)}`
    : `${sign}${percent}`
}

/** The HTML page separates the unit with a hair space; plain text reads better with a regular one. */
export function withRegularSpaces(text: string) {
  return text.replaceAll('\u200A', ' ')
}

export function formatUsd(value: number) {
  return withRegularSpaces(formatCurrency(value, 'usd'))
}

export function formatCount(value: number) {
  return withRegularSpaces(formatInteger(value))
}

/** Same marker placement as the HTML risk lists: before the closing punctuation, commas included. */
export function markCritical(text: string, isCritical: boolean | undefined) {
  if (!isCritical) return text
  const [, body, punctuation] = text.match(/^(.*?)([.,;:!?]?)$/s) ?? []
  return `${body} (CRITICAL)${punctuation}`
}

/**
 * Links written for the HTML page (site paths like "/stages", fragments like
 * "#permissions", queries like "?update=1") only resolve on the site; the
 * markdown is read elsewhere, so they are resolved against the HTML page.
 */
export function absolutizeLinks(markdown: string, pageUrl: string) {
  const { origin } = new URL(pageUrl)
  return markdown
    .replaceAll(/\]\(\/(?!\/)/g, `](${origin}/`)
    .replaceAll(/\]\((?=[#?])/g, `](${pageUrl}`)
}
