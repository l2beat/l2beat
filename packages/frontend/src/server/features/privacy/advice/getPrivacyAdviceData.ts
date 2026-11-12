import type {
  PrivacyAdversary,
  PrivacyAdversarySentiment,
  PrivacyExitWindow,
} from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import countBy from 'lodash/countBy'
import mapValues from 'lodash/mapValues'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { anonymitySetCoverageNote } from '~/components/projects/sections/sectionCopy'
import { getReferenceAppLabel } from '~/pages/privacy/referenceAppUi'
import type {
  Holding,
  RankableProtocol,
} from '~/pages/privacy/stay-private/rankProtocols'
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

/** One protocol the guide can rank and walk, with only what the guide shows. */
export interface PrivacyAdviceProtocol extends RankableProtocol {
  icon: string
  href: string
  /** The field the ratings grade, e.g. "Hides which deposit funds which withdrawal." */
  promise: string
  /** Shown for context, never ranked: value is not privacy. */
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
  waitWindowDays: number
  /** The filters' choices, from what the protocols hold. */
  options: {
    kinds: { id: string; label: string }[]
    assets: string[]
    chains: string[]
  }
}

/**
 * Active privacy protocols with advice, by name; the page ranks them per
 * visitor. Protocols without advice have no step that changes a cell.
 */
export async function getPrivacyAdviceData(): Promise<PrivacyAdviceData> {
  const projects = (await getPrivacyProjects()).filter(
    (project) => project.privacyInfo.adversaries.advice !== undefined,
  )
  const entries = new Map(
    (await getPrivacySummaryEntries(projects)).map((e) => [e.id, e]),
  )
  const protocols = projects
    .map((project) => toAdviceProtocol(project, entries.get(project.id)))
    .sort((a, b) => a.name.localeCompare(b.name))
  return {
    protocols,
    adversaries: projects[0]?.privacyInfo.adversaries.adversaries ?? [],
    waitWindowDays: ANONYMITY_SET_WINDOW_DAYS,
    options: getFilterOptions(protocols),
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
    categoryId: privacyInfo.category.id,
    categoryLabel: privacyInfo.category.label,
    promise: adversaries.promise.text,
    steps: adversaries.advice ?? [],
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
    exitWindowSentiment: toAdversarySentiment(privacyInfo.exitWindow.sentiment),
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

/** Exit windows can be neutral or under review, which rank as no data. */
function toAdversarySentiment(
  sentiment: PrivacyExitWindow['sentiment'],
): PrivacyAdversarySentiment | undefined {
  return sentiment === 'good' || sentiment === 'warning' || sentiment === 'bad'
    ? sentiment
    : undefined
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

/** Assets listed by how many protocols hold them, so common ones come first. */
function getFilterOptions(protocols: PrivacyAdviceProtocol[]) {
  const holders = (pick: (h: Holding) => string) =>
    countBy(
      protocols.flatMap((p) => uniq(p.holdings.map(pick))),
      (value) => value,
    )
  const byHolders = (counts: Record<string, number>) =>
    Object.keys(counts).sort(
      (a, b) => (counts[b] ?? 0) - (counts[a] ?? 0) || a.localeCompare(b),
    )
  return {
    kinds: uniqBy(
      protocols.map((p) => ({ id: p.categoryId, label: p.categoryLabel })),
      (kind) => kind.id,
    ).sort((a, b) => a.label.localeCompare(b.label)),
    assets: byHolders(holders((h) => h.symbol)),
    chains: byHolders(holders((h) => h.chain)),
  }
}
