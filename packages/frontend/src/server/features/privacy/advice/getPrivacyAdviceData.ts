import type {
  PrivacyAdversary,
  PrivacyAdviceStep,
  PrivacyExitWindow,
  PrivacyNeed,
} from '@l2beat/config'
import { PRIVACY_NEEDS } from '@l2beat/config/build/common/privacyCategories'
import {
  PRIVACY_TOOLS,
  type PrivacyTool,
} from '@l2beat/config/build/common/privacyTools'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import mapValues from 'lodash/mapValues'
import uniqBy from 'lodash/uniqBy'
import { anonymitySetCoverageNote } from '~/components/projects/sections/sectionCopy'
import {
  PRIVACY_METHODOLOGY_PATH,
  PRIVACY_ROUTES_ANCHOR,
} from '~/pages/privacy/methodology/paths'
import { getReferenceAppLabel } from '~/pages/privacy/referenceAppUi'
import type {
  Holding,
  MatchableProtocol,
} from '~/pages/privacy/stay-private/matchProtocols'
import { getAnonymitySetSyncingNote } from '~/pages/privacy/summary/components/anonymitySetTooltip'
import { manifest } from '~/utils/Manifest'
import { ANONYMITY_SET_WINDOW_DAYS } from '../anonymity-set/calculateAnonymitySets'
import type { PrivacyAnonymitySetSummary } from '../anonymity-set/getPrivacyAnonymitySetSummaries'
import { getPrivacyProjects } from '../getPrivacyProjects'
import {
  getPrivacySummaryEntries,
  type PrivacySummaryEntry,
} from '../getPrivacySummaryEntries'
import type { PrivacyProject } from '../types'
import { getPrivacyReferenceApp } from '../utils/getPrivacyReferenceApp'

/** One protocol the guide can match and walk, with only what the guide shows. */
export interface PrivacyAdviceProtocol extends MatchableProtocol {
  steps: PrivacyAdviceGuideStep[]
  icon: string
  href: string
  categoryLabel: string
  /** The field the ratings grade, e.g. "Hides which deposit funds which withdrawal." */
  promise: string
  /** Shown for context, never compared: value is not privacy. */
  tvsUsd: number | undefined
  /** What the operator can see or change, from the privileged insider cell. */
  insider: string
  exitWindow: Pick<PrivacyExitWindow, 'value' | 'sentiment' | 'description'>
  anonymitySet: PrivacyAdviceAnonymitySet
  /** The app the steps assume. Absent when the review names none. */
  referenceApp?: { label: string; url: string; iconUrl: string; since: string }
  isUnderReview: boolean
  redWarning?: string
}

/** A step with the outside tools its text links, so a setup can list them. */
export interface PrivacyAdviceGuideStep extends PrivacyAdviceStep {
  tools: PrivacyAdviceTool[]
}

export interface PrivacyAdviceTool {
  /** As the step calls it, e.g. "Whonix" for the Tor systems entry. */
  name: string
  /** Its entry on the methodology page, which holds the download. */
  href: string
  /** What getting it takes, e.g. "a paid install". Absent for a route of the user's choice. */
  effort?: string
}

/** The count the wait draws its window from, with every caveat as text. */
export type PrivacyAdviceAnonymitySet =
  | {
      status: 'available'
      value: number
      label?: string
      description: string
      notes: string[]
    }
  | { status: 'missing'; text: string }

export interface PrivacyAdviceData {
  protocols: PrivacyAdviceProtocol[]
  adversaries: PrivacyAdversary[]
  /** The needs that some protocol serves, in the order the guide offers them. */
  needs: PrivacyNeed[]
  waitWindowDays: number
}

/**
 * Every active privacy protocol, by name. The page matches them per visitor.
 * A protocol without advice stays in: no step changes its ratings, which is
 * what a visitor comparing it needs to see.
 */
export async function getPrivacyAdviceData(): Promise<PrivacyAdviceData> {
  const projects = await getPrivacyProjects()
  const entries = new Map(
    (await getPrivacySummaryEntries(projects)).map((e) => [e.id, e]),
  )
  const protocols = projects
    .map((project) => toAdviceProtocol(project, entries.get(project.id)))
    .sort((a, b) => a.name.localeCompare(b.name))
  return {
    protocols,
    adversaries: projects[0]?.privacyInfo.adversaries.adversaries ?? [],
    needs: Object.values(PRIVACY_NEEDS).filter((need) =>
      protocols.some((p) => p.needId === need.id),
    ),
    waitWindowDays: ANONYMITY_SET_WINDOW_DAYS,
  }
}

function toAdviceProtocol(
  project: PrivacyProject,
  entry: PrivacySummaryEntry | undefined,
): PrivacyAdviceProtocol {
  const anonymitySet = entry?.anonymitySet ?? { status: 'unavailable' }
  const { privacyInfo, statuses } = project
  const { adversaries } = privacyInfo
  const icon = manifest.getUrl(`/icons/${project.slug}.png`)
  const app =
    privacyInfo.referenceApp &&
    getPrivacyReferenceApp(privacyInfo.referenceApp, icon)
  return {
    slug: project.slug,
    name: project.name,
    icon,
    href: `/privacy/projects/${project.slug}`,
    needId: privacyInfo.category.need,
    categoryLabel: privacyInfo.category.label,
    promise: adversaries.promise.text,
    steps: (adversaries.advice ?? []).map((step) => ({
      ...step,
      tools: getStepTools(step.text),
    })),
    sentiments: mapValues(adversaries.cells, (cell) => cell.sentiment),
    insider: adversaries.cells.privilegedInsider.exposureShort,
    exitWindow: {
      value: privacyInfo.exitWindow.value,
      sentiment: privacyInfo.exitWindow.sentiment,
      description: privacyInfo.exitWindow.description,
    },
    anonymitySet: toAdviceAnonymitySet(anonymitySet),
    anonymitySetSize:
      anonymitySet.status === 'available' ? anonymitySet.value : undefined,
    holdings: getHoldings(project),
    tvsUsd: entry?.totalValueLockedUsd,
    referenceApp: app && {
      label: getReferenceAppLabel(app),
      url: app.url,
      iconUrl: app.iconUrl,
      since: app.since,
    },
    isUnderReview: !!statuses.reviewStatus,
    redWarning: statuses.redWarning?.text,
  }
}

const TOOLS: PrivacyTool[] = Object.values(PRIVACY_TOOLS)
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

/**
 * The tools a step links on the methodology page: registry entries by their
 * anchor, and the list of routes where the step leaves the route to the user.
 * A config test makes every step link the tools it names, so none is missed.
 */
export function getStepTools(text: string): PrivacyAdviceTool[] {
  const tools = [...text.matchAll(MARKDOWN_LINK)].flatMap(
    ([, label = '', href = '']): PrivacyAdviceTool[] => {
      const [path, anchor] = href.split('#')
      if (path !== PRIVACY_METHODOLOGY_PATH) return []
      if (anchor === PRIVACY_ROUTES_ANCHOR) {
        return [{ name: 'IP-hiding route', href }]
      }
      const tool = TOOLS.find((t) => t.anchor === anchor)
      if (!tool) return []
      return [
        {
          name: tool.names.find((name) => label.includes(name)) ?? label,
          href,
          effort: getToolEffort(tool),
        },
      ]
    },
  )
  return uniqBy(tools, (tool) => tool.name)
}

/** An entry's text opens with the effort it takes, as its first sentence. */
function getToolEffort(tool: PrivacyTool) {
  return tool.text.split('. ')[0]?.replace(/\.$/, '')
}

function toAdviceAnonymitySet(
  summary: PrivacyAnonymitySetSummary,
): PrivacyAdviceAnonymitySet {
  switch (summary.status) {
    case 'available':
      return {
        status: 'available',
        value: summary.value,
        label: summary.series.headlineLabel,
        description: summary.series.description,
        notes: [
          getAnonymitySetSyncingNote(summary),
          anonymitySetCoverageNote(summary.coverage, ANONYMITY_SET_WINDOW_DAYS),
        ].filter((note) => note !== undefined),
      }
    case 'not-applicable':
      return { status: 'missing', text: summary.description }
    case 'too-small':
      return { status: 'missing', text: 'Too few users to track exactly.' }
    case 'syncing':
      return {
        status: 'missing',
        text: 'Still being indexed, so there is no count yet.',
      }
    case 'unavailable':
      return { status: 'missing', text: 'We do not track it.' }
  }
}

function getHoldings(project: PrivacyProject): Holding[] {
  const holdings = project.privacyInfo.tokens.flatMap((token) =>
    token.buckets.map((bucket) => ({
      symbol: token.token.symbol,
      chain:
        typeof bucket.address === 'string'
          ? ChainSpecificAddress.longChain(bucket.address)
          : bucket.address.chain,
    })),
  )
  return uniqBy(holdings, (h) => `${h.symbol}@${h.chain}`)
}
