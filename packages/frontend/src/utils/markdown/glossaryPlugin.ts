import { assert } from '@l2beat/shared-pure'
import type MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'

export function linkGlossaryTerms(
  glossary: GlossaryTerm[],
  ignoreDelimiter = ':',
) {
  const ignorePattern = new RegExp(
    `${ignoreDelimiter}([a-zA-Z\\s]+)${ignoreDelimiter}`,
    'gi',
  )

  const termToData = new Map(
    glossary.flatMap((entry) =>
      entry.matches.map((term) => [
        term.toLowerCase(),
        { id: entry.id, description: entry.description },
      ]),
    ),
  )

  const glossaryTerms = [...termToData.keys()].sort(
    (a, b) => b.length - a.length,
  )

  return (sourceText: string) => {
    const ignoredOffsets = getIgnoredAndLinkOffsets(sourceText)
    const isWithinIgnoredOffset = (position: number) =>
      ignoredOffsets.some(
        (link) => position >= link.start && position <= link.end,
      )
    const isIgnored = (start: number, end: number) =>
      sourceText.at(start - 1) === ignoreDelimiter &&
      sourceText.at(end) === ignoreDelimiter

    // Longer terms claim their text first; a shorter term never links inside
    // a longer one, and nothing links inside an existing link or code span.
    // Working on offsets into the untouched source keeps this a single scan
    // per term instead of rebuilding the text once per term.
    const links: { start: number; end: number; markdown: string }[] = []
    const overlapsLink = (start: number, end: number) =>
      links.some((link) => start < link.end && end > link.start)

    for (const term of glossaryTerms) {
      const pattern = new RegExp(`(?<!\\w)(${escapeRegExp(term)})(?!\\w)`, 'gi')
      for (const match of sourceText.matchAll(pattern)) {
        const start = match.index
        const end = start + match[0].length
        if (
          isWithinIgnoredOffset(start) ||
          isIgnored(start, end) ||
          overlapsLink(start, end)
        ) {
          continue
        }
        const glossaryTermData = termToData.get(match[0].toLowerCase())
        if (!glossaryTermData) continue
        links.push({
          start,
          end,
          markdown: createGlossaryLink(
            glossaryTermData.id,
            match[0],
            glossaryTermData.description,
          ),
        })
      }
    }

    links.sort((a, b) => a.start - b.start)
    let text = ''
    let cursor = 0
    for (const link of links) {
      text += sourceText.slice(cursor, link.start) + link.markdown
      cursor = link.end
    }
    text += sourceText.slice(cursor)

    // Get rid of the ignore delimiters
    return text.replace(ignorePattern, '$1')
  }
}

/**
 * Pass as the markdown-it render env to also render each glossary term's
 * description as a hidden element the links point to via aria-describedby.
 * The tooltip is mounted only on the client, so without it the explanation is
 * missing from the server-rendered HTML. The prefix keeps ids unique when a
 * page renders several markdown blocks.
 */
export interface GlossaryRenderEnv {
  glossaryDescriptionIdPrefix?: string
  /** Filled by the plugin while rendering; callers leave it empty. */
  glossaryDescriptions?: GlossaryDescriptionsState
}

interface GlossaryDescriptionsState {
  describedTermIds: Set<string>
  pendingAfterLink: { id: string; description: string } | undefined
}

export function glossaryPlugin(md: MarkdownIt) {
  const defaultRender: RenderRule =
    md.renderer.rules.link_open ??
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options)
    }
  const defaultCloseRender: RenderRule =
    md.renderer.rules.link_close ??
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = (
    tokens,
    index,
    options,
    env: GlossaryRenderEnv,
    self,
  ) => {
    const token = tokens[index]
    assert(token, 'Token is not defined')
    const href = token.attrGet('href')
    if (isGlossaryLink(href)) {
      const [cleanHref, encodedDescription] = href?.split('?description=') || []
      assert(
        cleanHref && encodedDescription,
        'Href or description is not defined',
      )
      const description = decodeURIComponent(encodedDescription)

      token.attrSet('data-link-role', 'glossary')
      token.attrSet('data-description', description)
      token.attrSet('href', cleanHref)
      describeGlossaryLink(token, cleanHref, description, env)
    }
    return defaultRender(tokens, index, options, env, self)
  }

  md.renderer.rules.link_close = (
    tokens,
    index,
    options,
    env: GlossaryRenderEnv,
    self,
  ) => {
    const rendered = defaultCloseRender(tokens, index, options, env, self)
    const pending = env?.glossaryDescriptions?.pendingAfterLink
    if (!pending) return rendered

    env.glossaryDescriptions = {
      describedTermIds: env.glossaryDescriptions?.describedTermIds ?? new Set(),
      pendingAfterLink: undefined,
    }
    return `${rendered}<span id="${md.utils.escapeHtml(pending.id)}" class="sr-only">${md.utils.escapeHtml(pending.description)}</span>`
  }
}

// Every link to a term points at one hidden description, rendered after the
// term's first link, so repeated terms do not repeat the explanation.
function describeGlossaryLink(
  token: Token,
  cleanHref: string,
  description: string,
  env: GlossaryRenderEnv | undefined,
) {
  if (!env?.glossaryDescriptionIdPrefix) return
  const termId = cleanHref.split('#')[1]
  if (!termId) return

  const id = `${env.glossaryDescriptionIdPrefix}-glossary-${termId}`
  token.attrSet('aria-describedby', id)

  env.glossaryDescriptions ??= {
    describedTermIds: new Set(),
    pendingAfterLink: undefined,
  }
  if (env.glossaryDescriptions.describedTermIds.has(termId)) return
  env.glossaryDescriptions.describedTermIds.add(termId)
  env.glossaryDescriptions.pendingAfterLink = { id, description }
}

function createGlossaryLink(id: string, term: string, description: string) {
  const href = `/glossary#${id}?description=${encodeURIComponent(description)}`

  return `[${term}](${href})`
}

// Escape special characters in the term to use it in a regex pattern
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function getIgnoredAndLinkOffsets(text: string) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  const backtickPattern = /`([^`]*)`/g

  const linkOffsets = [...text.matchAll(linkPattern)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
  }))

  const backtickOffsets = [...text.matchAll(backtickPattern)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
  }))

  return linkOffsets.concat(backtickOffsets)
}

function isGlossaryLink(href: string | null) {
  return href?.includes('/glossary#')
}
