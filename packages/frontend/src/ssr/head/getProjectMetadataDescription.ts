import type {
  InteropType,
  ProjectScalingCategory,
  ProjectScalingStage,
  Stage,
} from '@l2beat/config'
import {
  formatCurrency,
  type KnownInteropBridgeType,
} from '@l2beat/shared-pure'
import { TRANSFER_TYPE_DISPLAY } from '~/pages/interop/utils/display'

export function getScalingMetadataDescription(project: {
  name: string
  category: ProjectScalingCategory | undefined
  stage: ProjectScalingStage['stage']
  hostChain: string | undefined
  tvs: number | undefined
  description: string
}) {
  const category =
    project.category === undefined || project.category === 'Other'
      ? 'scaling project'
      : project.category
  const stage = isAssignedStage(project.stage) ? project.stage : undefined
  const kind = withArticle([stage, category].filter(Boolean).join(' '))
  const host = project.hostChain ? ` on ${project.hostChain}` : ''
  const tvs =
    project.tvs !== undefined ? ` securing ${formatUsd(project.tvs)}` : ''
  return joinWithinLimit(
    `${project.name} is ${kind}${host}${tvs}.`,
    project.description,
  )
}

export function getDaMetadataDescription(project: {
  name: string
  type: string
  tvs: number
  economicSecurity: number | undefined
  description: string
}) {
  const economicSecurity =
    project.economicSecurity !== undefined
      ? `, with ${formatUsd(project.economicSecurity)} in economic security`
      : ''
  return joinWithinLimit(
    `${project.name} is a DA layer (${project.type}) securing ${formatUsd(project.tvs)}${economicSecurity}.`,
    project.description,
  )
}

export function getZkCatalogMetadataDescription(project: {
  name: string
  creator: string | undefined
  tvs: number
  description: string
}) {
  const creator = project.creator ? ` by ${project.creator}` : ''
  return joinWithinLimit(
    `${project.name} is a ZK proof system${creator} securing ${formatUsd(project.tvs)}.`,
    project.description,
  )
}

export function getInteropMetadataDescription(project: {
  name: string
  type: InteropType
  bridgeTypes: KnownInteropBridgeType[]
  last24hVolume: number | undefined
  description: string | undefined
}) {
  const bridgeTypes =
    project.bridgeTypes.length > 0
      ? ` (${project.bridgeTypes.map((type) => TRANSFER_TYPE_DISPLAY[type].label).join(', ')})`
      : ''
  const volume =
    project.last24hVolume !== undefined
      ? ` with ${formatUsd(project.last24hVolume)} volume in the last 24h`
      : ''
  return joinWithinLimit(
    `${project.name} is ${withArticle(INTEROP_TYPE_NOUN[project.type])}${bridgeTypes}${volume}.`,
    project.description,
  )
}

/** For project pages that have no key facts to lead with. */
export function getProjectMetadataDescription(project: {
  name: string
  display: { description: string }
}) {
  return joinWithinLimit(
    `Explore ${project.name} metrics and in-depth research.`,
    project.display.description,
  )
}

// Search engines cut snippets at roughly 155-160 chars mid-word; ending on our
// own word boundary keeps the key facts intact and the cut readable.
const MAX_LENGTH = 160
const ELLIPSIS = '…'

function joinWithinLimit(facts: string, description: string | undefined) {
  const full = description ? `${facts} ${description}` : facts
  if (full.length <= MAX_LENGTH) {
    return full
  }
  const fitting = full.slice(0, MAX_LENGTH - ELLIPSIS.length + 1)
  return fitting.slice(0, fitting.lastIndexOf(' ')) + ELLIPSIS
}

const INTEROP_TYPE_NOUN: Record<InteropType, string> = {
  intent: 'intent bridge',
  canonical: 'canonical bridge',
  multichain: 'multichain interop protocol',
  other: 'interop protocol',
}

function isAssignedStage(stage: ProjectScalingStage['stage']): stage is Stage {
  return stage !== 'NotApplicable' && stage !== 'UnderReview'
}

function withArticle(noun: string) {
  return /^[aeiou]/i.test(noun) ? `an ${noun}` : `a ${noun}`
}

// The site's hair space between number and unit renders inconsistently in
// search snippets, so meta text uses the compact "$16.20B" form.
function formatUsd(value: number) {
  return formatCurrency(value, 'usd').replace(/\s/g, '')
}
