import { Layer2, Layer3 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { getRiskValues } from '../../../../utils/risks/values'
import { getDetailedTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { formatUSD } from '../../../../utils/utils'
import { getTokens } from '../../../project/common/getCharts'
import { isAnySectionUnderReview } from '../../../project/common/isAnySectionUnderReview'
import { ScalingTvlViewEntry, TvlPagesData } from '../types'
import { ScalingTvlViewProps } from '../view/ScalingTvlView'

export function getScalingTvlView(
  projects: (Layer2 | Layer3)[],
  pagesData: TvlPagesData,
): ScalingTvlViewProps {
  const included = getIncludedProjects(projects, pagesData.tvlApiResponse)
  const orderedProjects = orderByTvl(included, pagesData.tvlApiResponse)

  return {
    items: orderedProjects.map((project) =>
      getScalingTvlViewEntry(project, pagesData),
    ),
  }
}

function getScalingTvlViewEntry(
  project: Layer2 | Layer3,
  pagesData: TvlPagesData,
): ScalingTvlViewEntry {
  const {
    tvlApiResponse,
    excludedTokensTvlApiResponse,
    implementationChange,
    verificationStatus,
  } = pagesData

  const hasImplementationChanged =
    !!implementationChange?.projects[project.id.toString()]
  const isVerified = verificationStatus.projects[project.id.toString()]

  const projectData = tvlApiResponse.projects[project.id.toString()]
  const excludedAssociatedTokensProjectData =
    excludedTokensTvlApiResponse.projects[project.id.toString()]
  const { parts, partsWeeklyChange } = getDetailedTvlWithChange(
    projectData?.charts,
  )
  const {
    parts: excludedAssociatedTokensParts,
    partsWeeklyChange: excludedAssociatedTokensPartsWeeklyChange,
  } = getDetailedTvlWithChange(excludedAssociatedTokensProjectData?.charts)

  const tokens = getTokens(project.id, tvlApiResponse, true)
  const tokensWithoutAssociated = getTokens(
    project.id,
    excludedTokensTvlApiResponse,
    true,
  )

  return {
    type: project.type,
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
    isVerified,
    hasImplementationChanged,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    tvlWarning: project.display.tvlWarning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    data: {
      tvl: {
        value: parts.tvl,
        displayValue: formatUSD(parts.tvl),
        change: partsWeeklyChange.tvl,
      },
      cbv: {
        value: parts.canonical,
        displayValue: formatUSD(parts.canonical),
        change: partsWeeklyChange.canonical,
        tokens: tokens.filter((t) => t.info.type === 'CBV'),
      },
      ebv: {
        value: parts.external,
        displayValue: formatUSD(parts.external),
        change: partsWeeklyChange.external,
        tokens: tokens.filter((t) => t.info.type === 'EBV'),
      },
      nmv: {
        value: parts.native,
        displayValue: formatUSD(parts.native),
        change: partsWeeklyChange.native,
        tokens: tokens.filter((t) => t.info.type === 'NMV'),
      },
      excludedAssociatedTokens: {
        tvl: {
          value: excludedAssociatedTokensParts.tvl,
          displayValue: formatUSD(excludedAssociatedTokensParts.tvl),
          change: excludedAssociatedTokensPartsWeeklyChange.tvl,
        },
        cbv: {
          value: excludedAssociatedTokensParts.canonical,
          displayValue: formatUSD(excludedAssociatedTokensParts.canonical),
          change: excludedAssociatedTokensPartsWeeklyChange.canonical,
          tokens: tokensWithoutAssociated.filter((t) => t.info.type === 'CBV'),
        },
        ebv: {
          value: excludedAssociatedTokensParts.external,
          displayValue: formatUSD(excludedAssociatedTokensParts.external),
          change: excludedAssociatedTokensPartsWeeklyChange.external,
          tokens: tokensWithoutAssociated.filter((t) => t.info.type === 'EBV'),
        },
        nmv: {
          value: excludedAssociatedTokensParts.native,
          displayValue: formatUSD(excludedAssociatedTokensParts.native),
          change: excludedAssociatedTokensPartsWeeklyChange.native,
          tokens: tokensWithoutAssociated.filter((t) => t.info.type === 'NMV'),
        },
      },
    },
    stage:
      project.type === 'layer3' ? { stage: 'NotApplicable' } : project.stage,
  }
}

function getIncludedProjects(
  projects: (Layer2 | Layer3)[],
  tvlApiResponse: TvlApiResponse,
) {
  return projects.filter(
    (p) =>
      tvlApiResponse?.projects[p.id.toString()] &&
      !p.isUpcoming &&
      !p.isArchived,
  )
}
