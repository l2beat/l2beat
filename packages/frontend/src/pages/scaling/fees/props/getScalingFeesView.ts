import { Layer2 } from '@l2beat/config'
import {
  L2FeesApiChart,
  L2FeesApiResponse,
  notUndefined,
} from '@l2beat/shared-pure'

import { FeesData, FeesPagesData, ScalingFeesViewEntry } from '../types'
import { ScalingFeesViewProps } from '../view/ScalingFeesView'

const UPCOMING_PROJECTS = ['paradex']

export function getScalingFeesView(
  projects: Layer2[],
  pagesData: FeesPagesData,
): ScalingFeesViewProps {
  const { implementationChange, l2FeesApiResponse } = pagesData

  const includedProjects = getIncludedProjects(projects, l2FeesApiResponse)

  return {
    items: [
      ...includedProjects
        .map((project) => {
          const l2FeesProjectData =
            l2FeesApiResponse.projects[project.id.toString()]

          const hasImplementationChanged =
            !!implementationChange?.projects[project.id.toString()]

          return getScalingFeesViewEntry(
            project,
            l2FeesProjectData,
            hasImplementationChanged,
          )
        })
        .filter(notUndefined),
      getEthereumFeesViewEntry(l2FeesApiResponse),
    ],
  }
}

function getEthereumFeesViewEntry(
  l2FeesApiResponse: L2FeesApiResponse,
): ScalingFeesViewEntry {
  const l2FeesProjectData = l2FeesApiResponse.projects['ethereum']
  return {
    name: 'Ethereum',
    shortName: undefined,
    slug: 'ethereum',
    showProjectUnderReview: false,
    hasImplementationChanged: false,
    warning: undefined,
    redWarning: undefined,
    category: undefined,
    provider: undefined,
    purposes: undefined,
    stage: undefined,
    data: l2FeesProjectData ? getFeesData(l2FeesProjectData) : undefined,
  }
}

function getScalingFeesViewEntry(
  project: Layer2,
  l2FeesChart: L2FeesApiChart | undefined,
  hasImplementationChanged: boolean,
): ScalingFeesViewEntry {
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    showProjectUnderReview: !!project.isUnderReview,
    hasImplementationChanged,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
    stage: project.stage,
    data: l2FeesChart ? getFeesData(l2FeesChart) : undefined,
  }
}

function getFeesData(l2FeesChart: L2FeesApiChart): FeesData {
  return {
    ethTransfer: {
      gas: l2FeesChart.data[0][1] * 21_000,
      usdFee: l2FeesChart.data[0][2] * 21_000,
    },
    erc20Transfer: {
      gas: l2FeesChart.data[0][1] * 60_000,
      usdFee: l2FeesChart.data[0][2] * 60_000,
    },
    swap: {
      gas: l2FeesChart.data[0][1] * 300_000,
      usdFee: l2FeesChart.data[0][2] * 300_000,
    },
  }
}

function getIncludedProjects(
  projects: Layer2[],
  l2FeesApiResponse: L2FeesApiResponse,
) {
  return projects.filter(
    (p) =>
      (l2FeesApiResponse.projects[p.id.toString()] !== undefined ||
        UPCOMING_PROJECTS.includes(p.id.toString())) &&
      !p.isArchived &&
      !p.isUpcoming,
  )
}
