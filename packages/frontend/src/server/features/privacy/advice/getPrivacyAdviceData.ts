import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
  PrivacyExitWindow,
} from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import mapValues from 'lodash/mapValues'
import { anonymitySetCoverageNote } from '~/components/projects/sections/sectionCopy'
import { getReferenceAppLabel } from '~/pages/privacy/referenceAppUi'
import { getAnonymitySetSyncingNote } from '~/pages/privacy/summary/components/anonymitySetTooltip'
import { manifest } from '~/utils/Manifest'
import { ANONYMITY_SET_WINDOW_DAYS } from '../anonymity-set/calculateAnonymitySets'
import {
  getPrivacyAnonymitySetSummaries,
  type PrivacyAnonymitySetSummary,
} from '../anonymity-set/getPrivacyAnonymitySetSummaries'
import { getPrivacyProjects } from '../getPrivacyProjects'
import type { PrivacyProject } from '../types'
import { getPrivacyReferenceApp } from '../utils/getPrivacyReferenceApp'

/** One protocol the guide can walk, with only what the guide shows. */
export interface PrivacyAdviceProtocol {
  slug: string
  name: string
  icon: string
  href: string
  category: string
  steps: PrivacyAdviceStep[]
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>
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
}

/**
 * Active privacy protocols with advice, by name: the guide ranks none of them.
 * Protocols without advice have no step that changes a cell.
 */
export async function getPrivacyAdviceData(): Promise<PrivacyAdviceData> {
  const projects = (await getPrivacyProjects()).filter(
    (project) => project.privacyInfo.adversaries.advice !== undefined,
  )
  // The anonymity set alone: the guide shows no value or flows.
  const anonymitySets = await getPrivacyAnonymitySetSummaries(
    projects,
    UnixTime.toStartOf(UnixTime.now(), 'day'),
  )
  return {
    protocols: projects
      .map((project) =>
        toAdviceProtocol(
          project,
          anonymitySets.get(project.id) ?? { status: 'unavailable' },
        ),
      )
      .sort((a, b) => a.name.localeCompare(b.name)),
    adversaries: projects[0]?.privacyInfo.adversaries.adversaries ?? [],
    waitWindowDays: ANONYMITY_SET_WINDOW_DAYS,
  }
}

function toAdviceProtocol(
  project: PrivacyProject,
  anonymitySet: PrivacyAnonymitySetSummary,
): PrivacyAdviceProtocol {
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
    category: privacyInfo.category.label,
    steps: adversaries.advice ?? [],
    sentiments: mapValues(adversaries.cells, (cell) => cell.sentiment),
    insider: adversaries.cells.privilegedInsider.exposureShort,
    exitWindow: {
      value: privacyInfo.exitWindow.value,
      sentiment: privacyInfo.exitWindow.sentiment,
      description: privacyInfo.exitWindow.description,
    },
    anonymitySet: toAdviceAnonymitySet(anonymitySet),
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
