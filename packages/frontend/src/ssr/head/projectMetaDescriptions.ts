import type {
  InteropType,
  ProjectScalingCategory,
  ProjectScalingStage,
} from '@l2beat/config'
import { isAssignedStage } from '~/utils/project/isAssignedStage'

export function getScalingMetadataDescription(project: {
  category: ProjectScalingCategory | undefined
  stage: ProjectScalingStage['stage']
  hostChain: string | undefined
  tvs: number | undefined
  description: string
}) {
  const stage = isAssignedStage(project.stage) ? project.stage : undefined
  const category = project.category === 'Other' ? undefined : project.category
  return leadWithFacts(
    [
      joinWords(stage, unlessMentioned(category, project.description)),
      project.hostChain && `on ${project.hostChain}`,
      usd(project.tvs, 'TVS'),
    ],
    project.description,
  )
}

export function getDaMetadataDescription(project: {
  tvs: number
  economicSecurity: number | undefined
  description: string
}) {
  return leadWithFacts(
    [
      unlessMentioned('DA layer', project.description),
      usd(project.tvs, 'TVS'),
      usd(project.economicSecurity, 'economic security'),
    ],
    project.description,
  )
}

export function getZkCatalogMetadataDescription(project: {
  creator: string | undefined
  tvs: number
  description: string
}) {
  const creator = unlessMentioned(project.creator, project.description)
  return leadWithFacts(
    [creator && `created by ${creator}`, usd(project.tvs, 'TVS')],
    project.description,
  )
}

// No type lead: interop descriptions already open with the kind of bridge,
// often in other words than ours ("Liquidity bridge" for an intent protocol).
// They rarely name the project though, and many canonical bridges share one
// template text, so the name keeps each page's description distinct.
export function getInteropMetadataDescription(project: {
  name: string
  type: InteropType
  description: string | undefined
}) {
  const description = collapseWhitespace(project.description)
  if (!description) {
    return `${project.name} is ${withArticle(INTEROP_TYPE_NOUN[project.type])}.`
  }
  return fitWholeSentences(
    mentions(description, project.name)
      ? description
      : `${project.name} – ${description}`,
    MAX_LENGTH,
  )
}

/** For project pages that have no key facts to lead with. */
export function getProjectMetadataDescription(description: string) {
  return leadWithFacts([], description)
}

type Fact = string | undefined | false

// A fragment, not an "X is a…" sentence: the hand-written description already
// opens that way, so a sentence lead would say the same thing twice.
function leadWithFacts(facts: Fact[], rawDescription: string | undefined) {
  const stated = facts.filter(Boolean)
  const lead =
    stated.length > 0 ? `${capitalize(stated.join(' · '))}.` : undefined
  const description = collapseWhitespace(rawDescription)
  const budget = MAX_LENGTH - (lead ? lead.length + 1 : 0)
  return [lead, description && fitWholeSentences(description, budget)]
    .filter(Boolean)
    .join(' ')
}

// Search engines have no length limit and pick the part matching the query,
// so the cap only guards against the few essay-length descriptions.
const MAX_LENGTH = 300
const ELLIPSIS = '…'

function fitWholeSentences(text: string, budget: number) {
  if (text.length <= budget) {
    return text
  }
  const sentences = text.split(/(?<=[.!?])\s+/)
  let fitting = ''
  for (const sentence of sentences) {
    const next = fitting ? `${fitting} ${sentence}` : sentence
    if (next.length > budget) {
      break
    }
    fitting = next
  }
  return fitting || cutOnWordBoundary(text, budget)
}

function cutOnWordBoundary(text: string, budget: number) {
  const fitting = text.slice(0, budget - ELLIPSIS.length + 1)
  const wholeWords = fitting.slice(0, fitting.lastIndexOf(' '))
  return wholeWords.replace(/[\s,;:.]+$/, '') + ELLIPSIS
}

// Multi-line config strings carry their newlines and indentation.
function collapseWhitespace(text: string | undefined) {
  return text?.replace(/\s+/g, ' ').trim()
}

const INTEROP_TYPE_NOUN: Record<InteropType, string> = {
  intent: 'intent bridge',
  canonical: 'canonical bridge',
  multichain: 'multichain interop protocol',
  other: 'interop protocol',
}

function withArticle(noun: string) {
  return /^[aeiou]/i.test(noun) ? `an ${noun}` : `a ${noun}`
}

function unlessMentioned(fact: string | undefined, description: string) {
  return fact !== undefined && mentions(description, fact) ? undefined : fact
}

// Whole words only, so that "Base" is not found in "based"; a plural still
// counts ("ZK Rollups").
function mentions(text: string, phrase: string) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|\\W)${escaped}s?(\\W|$)`, 'i').test(text)
}

function joinWords(...words: Fact[]) {
  return words.filter(Boolean).join(' ') || undefined
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// A zero amount (upcoming or archived projects) says nothing useful, so it is
// left out like a missing one.
function usd(value: number | undefined, label: string) {
  return value ? `${COMPACT_USD.format(value)} ${label}` : undefined
}

// Two significant digits: a search index holds the snippet for days or weeks,
// and "$16B" stays true far longer than "$16.20B".
const COMPACT_USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumSignificantDigits: 2,
})
