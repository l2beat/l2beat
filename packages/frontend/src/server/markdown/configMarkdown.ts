/*
 * Config text (descriptions, explanations, .md files) is written for the HTML
 * page's markdown renderer, which forgives what a plain-text reader does not.
 * Every page takes it through `configMarkdown`, so the rest of the markdown
 * is assembled from text that is already clean.
 */

/**
 * Config text evened out and nested under the heading it is rendered below.
 * Optional config text that is absent renders as no block at all.
 */
export function configMarkdown(content: string | undefined, level: number) {
  if (content === undefined) return ''
  return nestHeadings(tidy(content), level)
}

/**
 * `<br>` tags become line breaks, stray whitespace and blank-line runs go,
 * bullets use one marker, and the indentation that template literals leave
 * on wrapped lines is dropped. Fenced code is kept verbatim, and lines that
 * could be indented code keep their spacing.
 */
function tidy(markdown: string) {
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
      const tidied = tidyLine(part, previous)
      const extendsBlankRun = tidied === '' && (previous ?? '') === ''
      if (!extendsBlankRun) lines.push(tidied)
    }
  }
  if (lines.at(-1) === '') lines.pop()
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

function tidyLine(line: string, previous: string | undefined) {
  const trimmed = line.trimEnd()
  if (isTableRow(trimmed)) return trimmed
  const [, indent = '', text = ''] = trimmed.match(/^(\s*)(.*)$/) ?? []
  const bulleted = text.replace(/^\* /, '- ')
  // Four spaces of indentation can start indented code, whose spacing matters.
  const spaced =
    indent.length >= 4 ? bulleted : collapseSpacesOutsideCode(bulleted)
  return `${alignContinuation(indent, spaced, previous)}${spaced}`
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
 * rendered below instead of breaking the page outline.
 */
function nestHeadings(content: string, level: number) {
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
