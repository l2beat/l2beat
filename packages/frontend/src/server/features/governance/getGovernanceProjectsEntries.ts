import type {
  Project,
  ProjectPermissions,
  ProjectStageName,
  ProjectUpgradeableActor,
  TableReadyValue,
} from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../scaling/getCommonScalingEntry'
import { getCommonScalingEntry } from '../scaling/getCommonScalingEntry'
import { get7dTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import { compareTvs } from '../scaling/tvs/utils/compareTvs'

export interface GovernanceMultisigInfo {
  name: string
  chain: string
  /** Formatted as "M/N" when parseable from the multisig description. */
  threshold: string | undefined
  /** Parsed M from "M/N threshold" — used for the rose. */
  thresholdM: number | undefined
  /** Parsed N from "M/N threshold" — used for the rose. */
  thresholdN: number | undefined
  memberCount: number
  /** Capped sample of participants for the tooltip. */
  members: { name: string; url: string }[]
  /** Optional secondary-line breakdown for composite-governance projects. */
  breakdown?: string
}

export interface GovernanceProjectEntry extends CommonScalingEntry {
  multisig: GovernanceMultisigInfo | undefined
  stage: ProjectStageName
  censorship: TableReadyValue
  upgrade: TableReadyValue
  upgraders: ProjectUpgradeableActor[]
  tvsOrder: number
}

export async function getGovernanceProjectsEntries() {
  const [tvs, projectsChangeReport, projects] = await Promise.all([
    get7dTvsBreakdown({ type: 'layer2' }),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
      optional: ['permissions', 'contracts'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
  ])

  const entries = projects
    .filter((p) => p.statuses.reviewStatus !== 'initialReview')
    .map((project) =>
      getGovernanceProjectEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id]?.breakdown.total,
      ),
    )
    .sort(compareTvs)

  return groupByScalingTabs(entries)
}

function getGovernanceProjectEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingRisks' | 'display',
    'permissions' | 'contracts'
  >,
  changes: ProjectChanges,
  tvs: number | undefined,
): GovernanceProjectEntry {
  const risks = project.scalingRisks.stacked ?? project.scalingRisks.self
  return {
    ...getCommonScalingEntry({ project, changes }),
    multisig: applyThresholdOverride(
      project.id.toString(),
      pickPrimaryMultisig(project.permissions),
    ),
    stage: project.scalingInfo.stage,
    censorship: risks.sequencerFailure,
    upgrade: risks.exitWindow,
    upgraders: collectUpgraders(project.contracts?.addresses),
    tvsOrder: tvs ?? -1,
  }
}

/**
 * Per-project overrides for the Tx processing threshold when the raw discovered
 * multisig undersells the effective governance quorum. Reasoning for each
 * entry must be documented in the linked source.
 */
const THRESHOLD_OVERRIDES: Record<
  string,
  {
    thresholdM: number
    thresholdN: number
    name: string
    breakdown?: string
    source: string
  }
> = {
  // Base upgrades require both Coordinator (3/6) AND Security Council (8/11),
  // giving an effective 9/12 entity-level quorum.
  // See packages/config/src/projects/base/diffHistory.md (75% quorum entry).
  base: {
    thresholdM: 9,
    thresholdN: 12,
    name: 'Base Governance (Coordinator + Security Council)',
    breakdown: '3/6 + 8/11',
    source: 'base/diffHistory.md',
  },
}

function applyThresholdOverride(
  projectId: string,
  multisig: GovernanceMultisigInfo | undefined,
): GovernanceMultisigInfo | undefined {
  const override = THRESHOLD_OVERRIDES[projectId]
  if (!override) return multisig
  const base: GovernanceMultisigInfo = multisig ?? {
    name: override.name,
    chain: 'ethereum',
    threshold: undefined,
    thresholdM: undefined,
    thresholdN: undefined,
    memberCount: 0,
    members: [],
  }
  return {
    ...base,
    name: override.name,
    thresholdM: override.thresholdM,
    thresholdN: override.thresholdN,
    threshold: `${override.thresholdM}/${override.thresholdN}`,
    memberCount: override.thresholdN,
    breakdown: override.breakdown,
  }
}

const MULTISIG_DESC_REGEX = /A Multisig with (\d+)\/(\d+) threshold/

function pickPrimaryMultisig(
  permissions: Record<string, ProjectPermissions> | undefined,
): GovernanceMultisigInfo | undefined {
  if (!permissions) return undefined

  const chains = Object.keys(permissions)
  const ordered = [
    ...chains.filter((c) => c === 'ethereum'),
    ...chains.filter((c) => c !== 'ethereum'),
  ]

  for (const chain of ordered) {
    const perm = permissions[chain]
    if (!perm) continue
    // Multisigs live in `actors`; `roles` holds RBAC like owner/admin.
    const candidates = [...(perm.actors ?? []), ...(perm.roles ?? [])]
    const multisigs = candidates.filter(
      (r) => r.participants && r.participants.length > 0,
    )
    if (multisigs.length === 0) continue

    const council =
      multisigs.find((r) => /council/i.test(r.name)) ??
      multisigs.find((r) => /security/i.test(r.name))
    const picked = council ?? multisigs[0]!

    const match = picked.description.match(MULTISIG_DESC_REGEX)
    const memberCount = picked.participants?.length ?? 0
    const thresholdM = match ? Number(match[1]) : undefined
    const thresholdN = match ? Number(match[2]) : undefined

    return {
      name: picked.name,
      chain,
      threshold: match ? `${match[1]}/${match[2]}` : undefined,
      thresholdM,
      thresholdN,
      memberCount,
      members: (picked.participants ?? []).slice(0, 20).map((p) => ({
        name: p.name || 'Unnamed signer',
        url: p.url,
      })),
    }
  }
  return undefined
}

function collectUpgraders(
  addresses:
    | Record<string, { upgradableBy?: ProjectUpgradeableActor[] }[]>
    | undefined,
): ProjectUpgradeableActor[] {
  if (!addresses) return []
  const seen = new Map<string, ProjectUpgradeableActor>()
  for (const contracts of Object.values(addresses)) {
    for (const contract of contracts) {
      for (const actor of contract.upgradableBy ?? []) {
        const key = `${actor.name}|${actor.delay}`
        if (!seen.has(key)) seen.set(key, actor)
      }
    }
  }
  return [...seen.values()]
}
