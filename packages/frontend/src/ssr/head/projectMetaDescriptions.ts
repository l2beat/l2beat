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
      project.hostChain && `built on ${project.hostChain}`,
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
  return leadWithFacts(
    [
      joinWords(
        unlessMentioned('ZK proof system', project.description),
        project.creator && `by ${project.creator}`,
      ),
      usd(project.tvs, 'TVS'),
    ],
    project.description,
  )
}

export function getInteropMetadataDescription(project: {
  type: InteropType
  description: string | undefined
}) {
  return leadWithFacts(
    [unlessMentioned(INTEROP_TYPE_NOUN[project.type], project.description)],
    project.description,
  )
}

/** For project pages that have no key facts to lead with. */
export function getProjectMetadataDescription(description: string) {
  return leadWithFacts([], description)
}

type Fact = string | undefined | false

// A fragment, not an "X is a…" sentence: the hand-written description already
// opens that way, so a sentence lead would say the same thing twice.
function leadWithFacts(facts: Fact[], description: string | undefined) {
  const stated = facts.filter(Boolean)
  const lead =
    stated.length > 0 ? `${capitalize(stated.join(' · '))}.` : undefined
  return [lead, fitWholeSentences(description, lead)].filter(Boolean).join(' ')
}

// Search engines have no length limit and pick the part matching the query,
// so the cap only guards against the few essay-length descriptions.
const MAX_LENGTH = 300
const ELLIPSIS = '…'

function fitWholeSentences(
  description: string | undefined,
  lead: string | undefined,
) {
  if (!description) {
    return undefined
  }
  const budget = MAX_LENGTH - (lead ? lead.length + 1 : 0)
  if (description.length <= budget) {
    return description
  }
  const sentences = description.split(/(?<=[.!?])\s+/)
  let fitting = ''
  for (const sentence of sentences) {
    const next = fitting ? `${fitting} ${sentence}` : sentence
    if (next.length > budget) {
      break
    }
    fitting = next
  }
  return fitting || cutOnWordBoundary(description, budget)
}

function cutOnWordBoundary(text: string, budget: number) {
  const fitting = text.slice(0, budget - ELLIPSIS.length + 1)
  const wholeWords = fitting.slice(0, fitting.lastIndexOf(' '))
  return wholeWords.replace(/[\s,;:.]+$/, '') + ELLIPSIS
}

const INTEROP_TYPE_NOUN: Record<InteropType, string> = {
  intent: 'intent bridge',
  canonical: 'canonical bridge',
  multichain: 'multichain interop protocol',
  other: 'interop protocol',
}

function unlessMentioned(fact: string | undefined, description = '') {
  const mentioned =
    fact !== undefined && description.toLowerCase().includes(fact.toLowerCase())
  return mentioned ? undefined : fact
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
