import type {
  InteropType,
  ProjectScalingCategory,
  ProjectScalingStage,
} from '@l2beat/config'
import { isAssignedStage } from '~/utils/project/isAssignedStage'

export function getScalingMetadataDescription(project: {
  name: string
  category: ProjectScalingCategory | undefined
  stage: ProjectScalingStage['stage']
  hostChain: string | undefined
  tvs: number | undefined
  description: string
}) {
  const stage = isAssignedStage(project.stage) ? project.stage : undefined
  const category = project.category === 'Other' ? undefined : project.category
  return describe(
    [
      joinWords(stage, unlessMentioned(category, project.description)),
      unlessHostStated(project.hostChain, project.description),
      usd(project.tvs, 'TVS'),
    ],
    project,
  )
}

export function getDaMetadataDescription(project: {
  name: string
  tvs: number
  economicSecurity: number | undefined
  description: string
}) {
  return describe(
    [
      unlessMentioned('DA layer', project.description),
      usd(project.tvs, 'TVS'),
      usd(project.economicSecurity, 'economic security'),
    ],
    project,
  )
}

export function getZkCatalogMetadataDescription(project: {
  name: string
  creator: string | undefined
  tvs: number
  description: string
}) {
  const creator = unlessMentioned(
    project.creator,
    `${project.name} ${project.description}`,
  )
  return describe(
    [creator && `created by ${creator}`, usd(project.tvs, 'TVS')],
    project,
  )
}

// No type lead: interop descriptions already open with the kind of bridge,
// often in other words than ours ("Liquidity bridge" for an intent protocol).
export function getInteropMetadataDescription(project: {
  name: string
  type: InteropType
  description: string | undefined
}) {
  if (!project.description) {
    return `${project.name} is ${withArticle(INTEROP_TYPE_NOUN[project.type])}.`
  }
  return describe([], project)
}

/** For project pages that have no key facts to lead with. */
export function getProjectMetadataDescription(project: {
  name: string
  description: string
}) {
  return describe([], project)
}

type Fact = string | undefined | false

// A fragment, not an "X is a…" sentence: the hand-written description already
// opens that way, so a sentence lead would say the same thing twice.
function describe(
  facts: Fact[],
  project: { name: string; description: string | undefined },
) {
  const stated = facts.filter(Boolean)
  const lead =
    stated.length > 0 ? `${capitalize(stated.join(' · '))}.` : undefined
  const description = withName(
    project.name,
    collapseWhitespace(project.description),
  )
  const budget = MAX_LENGTH - (lead ? lead.length + 1 : 0)
  return [lead, description && fitWholeSentences(description, budget)]
    .filter(Boolean)
    .join(' ')
}

// Some descriptions never name their project ("A classic Ethereum mixer…"),
// and canonical bridges share one template text; the name makes the text
// stand on its own and keeps each page's description distinct.
function withName(name: string, description: string | undefined) {
  if (
    !description ||
    mentions(description, name) ||
    opensWithPartOfName(description, name)
  ) {
    return description
  }
  return `${name} – ${description}`
}

// Descriptions often use a shorter name than the listing: "Base is…" for
// Base Chain, "Hermez is…" for Polygon Hermez.
function opensWithPartOfName(description: string, name: string) {
  const [firstWord = ''] = description.split(' ')
  const subject = firstWord.replace(/(['’]s)?[,.:;]?$/, '').toLowerCase()
  const nameWords = name.toLowerCase().replace(/[()]/g, '').split(' ')
  return nameWords.includes(subject)
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

// "on Arbitrum" states the host, "built on the Arbitrum Orbit stack" names
// only the technology.
function unlessHostStated(hostChain: string | undefined, description: string) {
  if (!hostChain) {
    return undefined
  }
  const [firstWord] = hostChain.split(' ')
  const stated =
    mentions(description, hostChain) ||
    new RegExp(
      `\\bon ${escapeRegExp(firstWord ?? hostChain)}\\b(?! (stack|orbit|nitro))`,
      'i',
    ).test(description)
  return stated ? undefined : `on ${hostChain}`
}

function unlessMentioned(fact: string | undefined, description: string) {
  return fact !== undefined && mentions(description, fact) ? undefined : fact
}

// Whole words only, so that "Base" is not found in "based"; a plural still
// counts ("ZK Rollups").
function mentions(text: string, phrase: string) {
  return new RegExp(`(^|\\W)${escapeRegExp(phrase)}s?(\\W|$)`, 'i').test(text)
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function joinWords(...words: Fact[]) {
  return words.filter(Boolean).join(' ') || undefined
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// A missing, zero (upcoming or archived projects) or tiny amount says nothing
// useful: "$710 TVS" reads as noise.
const MIN_NOTABLE_USD = 100_000

function usd(value: number | undefined, label: string) {
  return value !== undefined && value >= MIN_NOTABLE_USD
    ? `${COMPACT_USD.format(value)} ${label}`
    : undefined
}

// Two significant digits: a search index holds the snippet for days or weeks,
// and "$16B" stays true far longer than "$16.20B".
const COMPACT_USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumSignificantDigits: 2,
})
