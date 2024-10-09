import { type Bridge, type ScalingProjectRiskViewEntry } from '@l2beat/config'
import compact from 'lodash/compact'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getTvlProjectStats } from '../../scaling/tvl/get-tvl-project-stats'
import { getAssociatedTokenWarning } from '../../scaling/tvl/utils/get-associated-token-warning'
import { getContractsVerificationStatuses } from '../../verification-status/get-contracts-verification-statuses'
import { getManuallyVerifiedContracts } from '../../verification-status/get-manually-verified-contracts'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getBridgeProjectDetails } from './utils/get-bridge-project-details'

export type BridgesProjectEntry = Awaited<
  ReturnType<typeof getBridgesProjectEntry>
>

export async function getBridgesProjectEntry(project: Bridge) {
  const [
    projectsVerificationStatuses,
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
    header,
  ] = await Promise.all([
    getProjectsVerificationStatuses(),
    getContractsVerificationStatuses(project),
    getManuallyVerifiedContracts(project),
    getImplementationChangeReport(),
    getHeader(project),
  ])

  const isVerified = !!projectsVerificationStatuses[project.id]
  const changes = implementationChangeReport.projects[project.id]
  const isImplementationUnderReview = !!changes?.ethereum

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    isUnderReview: !!project.isUnderReview,
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    isImplementationUnderReview,
    header,
    projectDetails: await getBridgeProjectDetails(
      project,
      isVerified,
      contractsVerificationStatuses,
      manuallyVerifiedContracts,
      implementationChangeReport,
    ),
  }
}

async function getHeader(project: Bridge) {
  const tvlProjectStats = await getTvlProjectStats(project)

  const associatedTokens = project.config.associatedTokens ?? []

  return {
    description: project.display.description,
    warning: project.display.warning,
    links: getProjectLinks(project.display.links),
    tvl: tvlProjectStats
      ? {
          tokenBreakdown: {
            ...tvlProjectStats.tokenBreakdown,
            warnings: compact([
              tvlProjectStats.tokenBreakdown.total > 0 &&
                getAssociatedTokenWarning({
                  associatedRatio:
                    tvlProjectStats.tokenBreakdown.associated /
                    tvlProjectStats.tokenBreakdown.total,
                  name: project.display.name,
                  associatedTokens,
                }),
            ]),
            associatedTokens,
          },
          tvlBreakdown: tvlProjectStats.tvlBreakdown,
        }
      : undefined,
    destination: getDestination(project.technology.destination),
    category: project.display.category,
    validatedBy: project.riskView?.validatedBy,
  }
}

function getDestination(destinations: string[]): ScalingProjectRiskViewEntry {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  const firstItem = destinations[0]
  if (destinations.length === 1 && firstItem) {
    return { value: firstItem, description: '', sentiment: 'neutral' }
  }

  return {
    value: 'Various',
    description: destinations.join(',\n'),
    sentiment: 'neutral',
  }
}
