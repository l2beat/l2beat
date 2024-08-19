import { type Layer3 } from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { isEmpty } from 'lodash'
import { getRiskSummarySection } from '~/app/_components/projects/sections/risk-summary/get-risk-summary'
import { getOperatorSection } from '~/app/_components/projects/sections/technology/get-operator-section'
import { getOtherConsiderationsSection } from '~/app/_components/projects/sections/technology/get-other-considerations-section'
import { getTechnologySection } from '~/app/_components/projects/sections/technology/get-technology-section'
import { getWithdrawalsSection } from '~/app/_components/projects/sections/technology/get-withdrawals-section'
import { type ProjectDetailsSection } from '~/app/_components/projects/sections/types'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { getDiagramParams } from '~/utils/project/get-diagram-params'

interface Params {
  project: Layer3
  isVerified: boolean
  contractsVerificationStatuses: ContractsVerificationStatuses
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  implementationChangeReport: ImplementationChangeReportApiResponse
  rosetteValues: RosetteValue[]
}

export function getL3ProjectDetails({
  project,
  isVerified,
  contractsVerificationStatuses,
  manuallyVerifiedContracts,
  implementationChangeReport,
  rosetteValues,
}: Params) {
  const permissionsSection = project.permissions
    ? getPermissionsSection(
        {
          id: project.id,
          type: project.type,
          hostChain: project.hostChain,
          isUnderReview: !!project.isUnderReview,
          permissions: project.permissions,
          nativePermissions: project.nativePermissions,
        },
        contractsVerificationStatuses,
        manuallyVerifiedContracts,
      )
    : undefined

  const contractsSection = getContractsSection(
    {
      id: project.id,
      type: project.type,
      hostChain: project.hostChain,
      isVerified,
      slug: project.display.slug,
      contracts: project.contracts,
      isUnderReview: project.isUnderReview,
      escrows: project.config.escrows,
    },
    contractsVerificationStatuses,
    manuallyVerifiedContracts,
    implementationChangeReport,
  )
  const riskSummary = getRiskSummarySection(project, isVerified)
  const technologySection = getTechnologySection(project)
  const operatorSection = getOperatorSection(project)
  const withdrawalsSection = getWithdrawalsSection(project)
  const otherConsiderationsSection = getOtherConsiderationsSection(project)

  const items: ProjectDetailsSection[] = []

  if (
    !project.isUpcoming &&
    project.milestones &&
    !isEmpty(project.milestones)
  ) {
    items.push({
      type: 'MilestonesSection',
      props: {
        id: 'milestones',
        title: 'Milestones',
        milestones: project.milestones,
      },
    })
  }

  if (project.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: project.display.description,
        detailedDescription: project.display.detailedDescription,
      },
    })
  }

  if (riskSummary.riskGroups.length > 0) {
    items.push({
      type: 'RiskSummarySection',
      props: riskSummary,
    })
  }

  if (project.isUpcoming) {
    items.push({
      type: 'UpcomingDisclaimer',
      excludeFromNavigation: true,
    })
    return items
  }

  items.push({
    type: 'RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      rosetteType: 'pizza',
      rosetteValues,
      warning: project.display.warning,
      redWarning: project.display.redWarning,
      isVerified,
      isUnderReview: project.isUnderReview,
    },
  })

  if (technologySection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'technology',
        title: 'Technology',
        ...technologySection,
      },
    })
  }

  if (project.stateDerivation) {
    items.push({
      type: 'StateDerivationSection',
      props: {
        id: 'state-derivation',
        title: 'State derivation',
        isUnderReview: project.isUnderReview,
        ...project.stateDerivation,
      },
    })
  }

  if (project.stateValidation) {
    items.push({
      type: 'StateValidationSection',
      props: {
        id: 'state-validation',
        title: 'State validation',
        stateValidation: project.stateValidation,
        diagram: getDiagramParams('state-validation', project.display.slug),
        isUnderReview: project.isUnderReview,
      },
    })
  }

  if (operatorSection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'operator',
        title: 'Operator',
        ...operatorSection,
      },
    })
  }

  if (withdrawalsSection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'withdrawals',
        title: 'Withdrawals',
        ...withdrawalsSection,
      },
    })
  }

  if (otherConsiderationsSection) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'other-considerations',
        title: 'Other considerations',
        ...otherConsiderationsSection,
      },
    })
  }

  if (permissionsSection) {
    items.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'permissions',
        title: 'Permissions',
      },
    })
  }

  if (contractsSection) {
    items.push({
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'contracts',
        title: 'Contracts',
      },
    })
  }

  if (project.knowledgeNuggets && !isEmpty(project.knowledgeNuggets)) {
    items.push({
      type: 'KnowledgeNuggetsSection',
      props: {
        knowledgeNuggets: project.knowledgeNuggets,
        id: 'knowledge-nuggets',
        title: 'Knowledge nuggets',
      },
    })
  }

  return items
}
