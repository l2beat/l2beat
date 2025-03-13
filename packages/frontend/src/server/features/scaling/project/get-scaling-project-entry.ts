import type {
  Badge,
  Project,
  ProjectScalingCategory,
  ProjectScalingStage,
  ReasonForBeingInOther,
  WarningWithSentiment,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import {
  isActivityChartDataEmpty,
  isTvsChartDataEmpty,
} from '~/server/features/utils/is-chart-data-empty'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/get-contract-utils'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getTrackedTransactions } from '~/utils/project/costs/get-tracked-transactions'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getScalingRiskSummarySection } from '~/utils/project/risk-summary/get-scaling-risk-summary'
import { getDataAvailabilitySection } from '~/utils/project/technology/get-data-availability-section'
import { getOperatorSection } from '~/utils/project/technology/get-operator-section'
import { getOtherConsiderationsSection } from '~/utils/project/technology/get-other-considerations-section'
import { getSequencingSection } from '~/utils/project/technology/get-sequencing-section'
import { getScalingTechnologySection } from '~/utils/project/technology/get-technology-section'
import { getWithdrawalsSection } from '~/utils/project/technology/get-withdrawals-section'
import type { UnderReviewStatus } from '~/utils/project/under-review'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getActivityProjectStats } from '../activity/get-activity-project-stats'
import { getTvsProjectStats } from '../tvs/get-tvs-project-stats'
import { getTokensForProject } from '../tvs/tokens/get-tokens-for-project'
import { getAssociatedTokenWarning } from '../tvs/utils/get-associated-token-warning'
import type { ProjectCountdownsWithContext } from '../utils/get-countdowns'
import { getCountdowns } from '../utils/get-countdowns'
import { isProjectOther } from '../utils/is-project-other'
import { getScalingDaSolution } from './get-scaling-da-solution'
import type { ScalingRosette } from './get-scaling-rosette-values'
import { getScalingRosette } from './get-scaling-rosette-values'

export interface ProjectScalingEntry {
  type: 'layer3' | 'layer2'
  name: string
  slug: string
  isArchived: boolean
  isUpcoming: boolean
  isAppchain: boolean
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: string
    description?: string
    badges?: Badge[]
    links: ProjectLink[]
    hostChain?: string
    category: ProjectScalingCategory
    purposes: string[]
    tvs?: {
      breakdown?: {
        total: number
        native: number
        canonical: number
        external: number
        totalChange: number
      }
      warning?: WarningWithSentiment
      tokens: {
        breakdown?: {
          total: number
          ether: number
          stablecoin: number
          associated: number
        }
        warnings: WarningWithSentiment[]
        associatedTokens: string[]
      }
    }
    activity?: {
      uopsCount: number
      lastDayUops: number
      uopsWeeklyChange: number
    }
    gasTokens?: string[]
  }
  rosette: ScalingRosette
  sections: ProjectDetailsSection[]
  countdowns: ProjectCountdownsWithContext
  reasonsForBeingOther?: ReasonForBeingInOther[]
  hostChainName: string
  stageConfig: ProjectScalingStage
}

export async function getScalingProjectEntry(
  project: Project<
    | 'display'
    | 'statuses'
    | 'scalingInfo'
    | 'scalingRisks'
    | 'scalingStage'
    | 'scalingTechnology'
    | 'contracts'
    | 'tvlInfo'
    | 'tvlConfig',
    // optional
    | 'permissions'
    | 'scalingDa'
    | 'customDa'
    | 'chainConfig'
    | 'isUpcoming'
    | 'isArchived'
    | 'milestones'
    | 'trackedTxsConfig'
  >,
): Promise<ProjectScalingEntry> {
  const [projectsChangeReport, activityProjectStats, tvsProjectStats] =
    await Promise.all([
      getProjectsChangeReport(),
      getActivityProjectStats(project.id),
      getTvsProjectStats(project),
    ])

  const header: ProjectScalingEntry['header'] = {
    description: project.display.description,
    warning: project.statuses.yellowWarning,
    redWarning: project.statuses.redWarning,
    category: isProjectOther(project.scalingInfo)
      ? 'Other'
      : project.scalingInfo.type,
    purposes: project.scalingInfo.purposes,
    activity: activityProjectStats,
    links: getProjectLinks(project.display.links),
    hostChain:
      project.scalingInfo.hostChain.id !== ProjectId.ETHEREUM
        ? project.scalingInfo.hostChain.name
        : undefined,
    tvs: !env.EXCLUDED_TVS_PROJECTS?.includes(project.id)
      ? {
          breakdown: tvsProjectStats?.tvsBreakdown,
          warning: project.tvlInfo.warnings[0],
          tokens: {
            breakdown: tvsProjectStats?.tokenBreakdown,
            warnings: compact([
              tvsProjectStats &&
                tvsProjectStats.tokenBreakdown.total > 0 &&
                getAssociatedTokenWarning({
                  associatedRatio:
                    tvsProjectStats.tokenBreakdown.associated /
                    tvsProjectStats.tokenBreakdown.total,
                  name: project.name,
                  associatedTokens: project.tvlInfo.associatedTokens,
                }),
            ]),
            associatedTokens: project.tvlInfo.associatedTokens,
          },
        }
      : undefined,
    badges: project.display.badges,
    gasTokens: project.chainConfig?.gasTokens,
  }

  const changes = projectsChangeReport.getChanges(project.id)
  const common = {
    type: project.scalingInfo.layer,
    name: project.name,
    slug: project.slug,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses.isUnderReview,
      ...changes,
    }),
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    isAppchain: project.scalingInfo.capability === 'appchain',
    header,
    reasonsForBeingOther: project.scalingInfo.reasonsForBeingOther,
    countdowns: getCountdowns(project),
    rosette: getScalingRosette(project),
    hostChainName: project.scalingInfo.hostChain.name,
    stageConfig: isProjectOther(project.scalingInfo)
      ? { stage: 'NotApplicable' as const }
      : project.scalingStage,
  }
  const daSolution = await getScalingDaSolution(project)

  await Promise.all([
    api.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens: false,
    }),
    api.activity.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
    }),
    project.scalingInfo.layer === 'layer2'
      ? api.costs.projectChart.prefetch({
          range: '1y',
          projectId: project.id,
        })
      : undefined,
  ])
  const [tvsChartData, activityChartData, costsChartData, tokens] =
    await Promise.all([
      api.tvs.chart({
        range: '1y',
        filter: { type: 'projects', projectIds: [project.id] },
        excludeAssociatedTokens: false,
      }),
      api.activity.chart({
        range: '1y',
        filter: { type: 'projects', projectIds: [project.id] },
      }),
      project.scalingInfo.layer === 'layer2'
        ? api.costs.projectChart({
            range: '1y',
            projectId: project.id,
          })
        : undefined,
      getTokensForProject(project.id),
    ])

  const sections: ProjectDetailsSection[] = []

  const sortedMilestones =
    project.milestones?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ) ?? []

  const hostChain =
    project.scalingInfo.hostChain.id !== ProjectId.ETHEREUM
      ? await ps.getProject({
          id: project.scalingInfo.hostChain.id,
          select: ['scalingTechnology', 'statuses'],
          optional: ['contracts'],
        })
      : undefined
  const isHostChainVerified = !hostChain?.statuses.isUnverified
  const hostChainWarning = hostChain
    ? {
        hostChainName: hostChain.name,
        hostChainSlug: hostChain.slug,
      }
    : undefined
  const hostChainRisksSummary =
    hostChain && getScalingRiskSummarySection(hostChain, isHostChainVerified)
  const hostChainWarningWithRiskCount =
    hostChain && hostChainRisksSummary
      ? {
          hostChainName: hostChain.name,
          hostChainSlug: hostChain.slug,
          riskCount: hostChainRisksSummary.riskGroups.flatMap((rg) => rg.items)
            .length,
        }
      : undefined

  if (!project.isUpcoming && !isTvsChartDataEmpty(tvsChartData)) {
    sections.push({
      type: 'ChartSection',
      props: {
        id: 'tvs',
        stacked: true,
        title: 'Value Secured',
        projectId: project.id,
        milestones: sortedMilestones,
        tokens,
      },
    })
  }

  if (!isActivityChartDataEmpty(activityChartData)) {
    sections.push({
      type: 'ChartSection',
      props: {
        id: 'activity',
        title: 'Activity',
        projectId: project.id,
        milestones: sortedMilestones,
        category: project.scalingInfo.type,
        projectName: project.name,
      },
    })
  }

  const trackedTransactions = getTrackedTransactions(project)
  if (
    !project.isUpcoming &&
    trackedTransactions &&
    costsChartData &&
    costsChartData.chart.length > 0
  ) {
    sections.push({
      type: 'CostsSection',
      props: {
        id: 'onchain-costs',
        title: 'Onchain costs',
        projectId: project.id,
        milestones: sortedMilestones,
        trackedTransactions,
      },
    })
  }

  if (
    !project.isUpcoming &&
    project.milestones &&
    project.milestones.length > 0
  ) {
    sections.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
        milestones: sortedMilestones,
      },
    })
  }

  if (project.scalingTechnology.detailedDescription) {
    sections.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: project.display.description,
        detailedDescription: project.scalingTechnology.detailedDescription,
      },
    })
  }

  const riskSummary = getScalingRiskSummarySection(
    project,
    !project.statuses.isUnverified,
  )
  if (riskSummary.riskGroups.length > 0) {
    sections.push({
      type: 'RiskSummarySection',
      props: {
        ...riskSummary,
        id: 'risk-summary',
        title: 'Risk summary',
        hostChainWarning: hostChainWarningWithRiskCount,
        isUnderReview: project.statuses.isUnderReview,
      },
    })
  }

  if (project.isUpcoming) {
    sections.push({
      type: 'UpcomingDisclaimer',
      excludeFromNavigation: true,
    })
    return { ...common, sections }
  }

  if (hostChain && common.rosette.host) {
    sections.push({
      type: 'L3RiskAnalysisSection',
      props: {
        id: 'risk-analysis',
        title: 'Risk analysis',
        l2: {
          name: hostChain.name,
          risks: common.rosette.host,
        },
        l3: {
          name: project.name,
          risks: common.rosette.self,
        },
        combined: common.rosette.stacked,
        warning: project.scalingTechnology.warning,
        redWarning: project.statuses.redWarning,
        isVerified: !project.statuses.isUnverified,
        isUnderReview: project.statuses.isUnderReview,
      },
    })
  } else {
    sections.push({
      type: 'RiskAnalysisSection',
      props: {
        id: 'risk-analysis',
        title: 'Risk analysis',
        rosetteValues: common.rosette.self,
        warning: project.scalingTechnology.warning,
        redWarning: project.statuses.redWarning,
        isVerified: !project.statuses.isUnverified,
        isUnderReview: project.statuses.isUnderReview,
      },
    })
  }

  if (project.scalingStage.stage !== 'NotApplicable') {
    sections.push({
      type: 'StageSection',
      props: {
        id: 'stage',
        title: 'Rollup stage',
        stageConfig: project.scalingStage,
        name: project.name,
        icon: `/icons/${project.slug}.png`,
        type: project.scalingInfo.type,
        isUnderReview: project.statuses.isUnderReview,
        isAppchain: project.scalingInfo.capability === 'appchain',
        additionalConsiderations:
          project.scalingStage.stage !== 'UnderReview'
            ? project.scalingStage.additionalConsiderations
            : undefined,
        scopeOfAssessment: project.scalingInfo.scopeOfAssessment,
      },
    })
  }

  const technologySection = getScalingTechnologySection(project)
  if (technologySection) {
    sections.push({
      type: 'TechnologySection',
      props: {
        id: 'technology',
        title: 'Technology',
        ...technologySection,
        hostChainWarning,
      },
    })
  }

  const dataAvailabilitySection = getDataAvailabilitySection(
    project,
    daSolution,
  )
  if (dataAvailabilitySection) {
    sections.push({
      type: dataAvailabilitySection.type,
      props: {
        id: 'da-layer',
        title: 'Data availability',
        ...dataAvailabilitySection.props,
      },
    } as ProjectDetailsSection)
  }

  if (project.scalingTechnology.stateDerivation) {
    sections.push({
      type: 'StateDerivationSection',
      props: {
        id: 'state-derivation',
        title: 'State derivation',
        isUnderReview:
          project.statuses.isUnderReview ||
          !!project.scalingTechnology.stateDerivation.isUnderReview,
        ...project.scalingTechnology.stateDerivation,
      },
    })
  }

  if (project.scalingTechnology.stateValidation) {
    sections.push({
      type: 'StateValidationSection',
      props: {
        id: 'state-validation',
        title: 'State validation',
        stateValidation: project.scalingTechnology.stateValidation,
        diagram: getDiagramParams(
          'state-validation',
          project.scalingTechnology.stateValidationImage ?? project.slug,
        ),
        isUnderReview:
          project.statuses.isUnderReview ||
          !!project.scalingTechnology.stateValidation.isUnderReview,
      },
    })
  }

  const operatorSection = getOperatorSection(project)
  if (operatorSection) {
    sections.push({
      type: 'TechnologySection',
      props: {
        id: 'operator',
        title: 'Operator',
        ...operatorSection,
        hostChainWarning,
      },
    })
  }

  const sequencingSection = getSequencingSection(project)
  if (sequencingSection) {
    sections.push({
      type: 'SequencingSection',
      props: {
        id: 'sequencing',
        title: 'Sequencing',
        ...sequencingSection,
      },
    })
  }

  const withdrawalsSection = getWithdrawalsSection(project)
  if (withdrawalsSection) {
    sections.push({
      type: 'TechnologySection',
      props: {
        id: 'withdrawals',
        title: 'Withdrawals',
        ...withdrawalsSection,
        hostChainWarning,
      },
    })
  }

  const otherConsiderationsSection = getOtherConsiderationsSection(project)
  if (otherConsiderationsSection) {
    sections.push({
      type: 'TechnologySection',
      props: {
        id: 'other-considerations',
        title: 'Other considerations',
        ...otherConsiderationsSection,
      },
    })
  }
  if (project.scalingTechnology.upgradesAndGovernance) {
    sections.push({
      type: 'MarkdownSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        content: project.scalingTechnology.upgradesAndGovernance,
        diagram: {
          type: 'upgrades-and-governance',
          slug:
            project.scalingTechnology.upgradesAndGovernanceImage ??
            project.slug,
        },
        mdClassName: 'text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
        isUnderReview: project.statuses.isUnderReview,
      },
    })
  }

  const contractUtils = await getContractUtils()

  const permissionsSection = getPermissionsSection(
    {
      id: project.id,
      type: project.scalingInfo.layer,
      hostChain: hostChain?.id,
      isUnderReview: project.statuses.isUnderReview,
      permissions: project.permissions,
      daSolution,
    },
    contractUtils,
  )
  if (permissionsSection) {
    const permissionedEntities = project.customDa?.dac?.knownMembers

    sections.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'permissions',
        title: 'Permissions',
        permissionedEntities,
      },
    })
  }

  const contractsSection = getContractsSection(
    {
      id: project.id,
      type: project.scalingInfo.layer,
      isVerified: !project.statuses.isUnverified,
      slug: project.slug,
      contracts: project.contracts,
      isUnderReview: project.statuses.isUnderReview,
      architectureImage: project.scalingTechnology.architectureImage,
      daSolution,
    },
    contractUtils,
    projectsChangeReport,
  )
  if (contractsSection) {
    sections.push({
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'contracts',
        title: 'Smart contracts',
      },
    })
  }

  return { ...common, sections }
}
