import type { Sentiment } from '@l2beat/config'
import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import {
  COMPARED_TO_PERIOD,
  formatPercent,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'

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
  return subsection(level, title, nestHeadings(text, level + 1))
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

export function withSentiment(value: string, sentiment: Sentiment | undefined) {
  return sentiment ? `${value} (sentiment: ${sentiment})` : value
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
 * Config text links site pages and images by path (e.g. "/images/x.png"),
 * which only resolves on the site; the markdown is read elsewhere.
 */
export function absolutizeLinks(markdown: string, origin: string) {
  return markdown.replaceAll(/\]\(\/(?!\/)/g, `](${origin}/`)
}

/**
 * Evens out the config text a page is assembled from, so every document reads
 * as clean markdown whichever project it describes: fragment links resolve
 * against the HTML page, `<br>` tags become line breaks, stray whitespace and
 * blank-line runs go, bullets use one marker, and the indentation that
 * template literals leave on wrapped lines is dropped. Fenced code is kept
 * verbatim, and lines that could be indented code keep their spacing.
 */
export function tidyMarkdown(markdown: string, pageUrl: string) {
  const lines: string[] = []
  let inCodeFence = false
  for (const line of markdown.split('\n')) {
    const isFence = isCodeFence(line)
    if (isFence) inCodeFence = !inCodeFence
    if (isFence || inCodeFence) {
      lines.push(line.trimEnd())
      continue
    }
    for (const part of splitAtLineBreakTags(line)) {
      const previous = lines.at(-1)
      const tidied = tidyLine(part, previous, pageUrl)
      const extendsBlankRun = tidied === '' && (previous ?? '') === ''
      if (!extendsBlankRun) lines.push(tidied)
    }
  }
  return lines.join('\n')
}

function isCodeFence(line: string) {
  return line.trimStart().startsWith('```')
}

const LINE_BREAK_TAG = /[ \t]*(?:<|&lt;)br\s*\/?(?:>|&gt;)[ \t]*/gi

/** A table row cannot span lines, so there the tag becomes a space. */
function splitAtLineBreakTags(line: string) {
  return isTableRow(line)
    ? [line.replaceAll(LINE_BREAK_TAG, ' ')]
    : line.split(LINE_BREAK_TAG)
}

function tidyLine(line: string, previous: string | undefined, pageUrl: string) {
  const resolved = resolveFragmentLinks(line.trimEnd(), pageUrl)
  if (isTableRow(resolved)) return resolved
  const [, indent = '', text = ''] = resolved.match(/^(\s*)(.*)$/) ?? []
  const bulleted = text.replace(/^\* /, '- ')
  // Four spaces of indentation can start indented code, whose spacing matters.
  const spaced =
    indent.length >= 4 ? bulleted : collapseSpacesOutsideCode(bulleted)
  return `${alignContinuation(indent, spaced, previous)}${spaced}`
}

/** Anchors point into the HTML page, which the markdown is not part of. */
function resolveFragmentLinks(line: string, pageUrl: string) {
  return line.replaceAll('](#', `](${pageUrl}#`)
}

function isTableRow(line: string) {
  return line.trimStart().startsWith('|')
}

function collapseSpacesOutsideCode(text: string) {
  return text
    .split(/(`[^`]*`)/)
    .map((part, i) => (i % 2 === 1 ? part : part.replaceAll(/ {2,}/g, ' ')))
    .join('')
}

/**
 * Text written in indented template literals keeps the source file's
 * indentation on its wrapped lines. Continuing a paragraph or a list item it
 * means nothing, so the line is aligned with the text it continues. Lines
 * that start a block (lists, headings, quotes) keep theirs, as it nests them.
 */
function alignContinuation(
  indent: string,
  text: string,
  previous: string | undefined,
) {
  if (previous === undefined || startsBlock(text)) return indent
  const previousText = previous.trimStart()
  if (previousText === '' || isTableRow(previous)) return indent
  if (/^(#|>|```)/.test(previousText)) return indent
  const listMarker = previousText.match(LIST_MARKER)?.[0] ?? ''
  const contentColumn =
    previous.length - previousText.length + listMarker.length
  return indent.length > contentColumn ? ' '.repeat(contentColumn) : indent
}

const LIST_MARKER = /^([-*+]|\d+[.)]) /

function startsBlock(text: string) {
  return LIST_MARKER.test(text) || /^(#|>|\||```)/.test(text)
}

/**
 * Config text can carry its own headings (e.g. "## Architecture"). Shifted so
 * the shallowest one lands at `level`, they nest under the heading the text is
 * rendered below instead of breaking the page outline. Optional config text
 * that is absent renders as no block at all.
 */
export function nestHeadings(content: string | undefined, level: number) {
  if (content === undefined) return ''
  const lines = content.split('\n')
  const headingDepthByLine = findHeadingDepthByLine(lines)
  if (headingDepthByLine.size === 0) return content

  const shift = level - Math.min(...headingDepthByLine.values())
  if (shift <= 0) return content

  return lines
    .map((line, i) => {
      const depth = headingDepthByLine.get(i)
      if (depth === undefined) return line
      const nestedDepth = Math.min(depth + shift, MAX_HEADING_DEPTH)
      return `${'#'.repeat(nestedDepth)}${line.slice(depth)}`
    })
    .join('\n')
}

const MAX_HEADING_DEPTH = 6

/** Skips fenced code, where `#` is literal. */
function findHeadingDepthByLine(lines: string[]) {
  const depths = new Map<number, number>()
  let inCodeFence = false
  for (const [i, line] of lines.entries()) {
    if (isCodeFence(line)) {
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
