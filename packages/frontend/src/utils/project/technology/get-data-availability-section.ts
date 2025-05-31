import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { GroupSectionProps } from '~/components/projects/sections/group-section'
import type { TechnologyChoicesSectionProps } from '~/components/projects/sections/technology-choices-section'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/pages/data-availability/utils/map-risks-to-rosette-values'
import { getDaLayerRisks } from '~/server/features/data-availability/utils/get-da-layer-risks'
import type { DaSolution } from '~/server/features/scaling/project/get-scaling-da-solution'
import { getProjectIcon } from '~/server/features/utils/get-project-icon'
import { getDiagramParams } from '../get-diagram-params'
import { toTechnologyRisk } from '../risk-summary/to-technology-risk'
import { getTechnologyChoicesSectionProps } from './get-technology-choices-section-props'
import { makeTechnologyChoice } from './make-technology-section'

type DataAvailabilitySection =
  | {
      type: 'Group'
      props:
        | Omit<GroupSectionProps, 'id' | 'title' | 'sectionOrder'>
        | undefined
    }
  | {
      type: 'TechnologyChoicesSection'
      props:
        | Omit<TechnologyChoicesSectionProps, 'id' | 'title' | 'sectionOrder'>
        | undefined
    }

export function getDataAvailabilitySection(
  project: Project<'statuses', 'customDa' | 'scalingTechnology' | 'scalingDa'>,
  daSolution?: DaSolution,
): DataAvailabilitySection | undefined {
  if (project.customDa) {
    return getCustomDaSection(project)
  }
  if (project.scalingTechnology?.dataAvailability) {
    return getPublicDaSection(
      {
        ...project,
        scalingTechnology: project.scalingTechnology,
      },
      daSolution,
    )
  }
  if (project.scalingTechnology?.isUnderReview)
    return {
      type: 'TechnologyChoicesSection',
      props: {
        items: [],
        isUnderReview: true,
      },
    }
}

function getCustomDaSection(
  project: Project<'statuses', 'customDa'>,
): Extract<DataAvailabilitySection, { type: 'Group' }> {
  assert(project.customDa, 'customDa is required')
  const daSubsections: ProjectDetailsSection[] = []

  const layerGrissiniValues = mapLayerRisksToRosetteValues(
    getDaLayerRisks(project.customDa),
  )
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(
    project.customDa.risks,
  )

  daSubsections.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-layer-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: undefined,
      isVerified: undefined,
      layerGrissiniValues,
      bridgeGrissiniValues,
    },
  })

  daSubsections.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: getDiagramParams('da-layer-technology', project.slug),
      content: project.customDa.technology.description,
      mdClassName:
        'da-beat text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
      risks: (project.customDa.technology.risks ?? []).map(toTechnologyRisk),
      references: project.customDa.technology.references,
    },
  })

  return {
    type: 'Group',
    props: {
      items: daSubsections,
      description: project.customDa?.description,
      isUnderReview: !!project.statuses.reviewStatus,
    },
  }
}

function getPublicDaSection(
  project: Project<'statuses' | 'scalingTechnology', 'scalingDa'>,
  daSolution?: DaSolution,
): Extract<DataAvailabilitySection, { type: 'TechnologyChoicesSection' }> {
  assert(
    project.scalingTechnology?.dataAvailability,
    'dataAvailability is required',
  )

  const props = getTechnologyChoicesSectionProps(project, [
    makeTechnologyChoice(
      'data-availability',
      project.scalingTechnology.dataAvailability,
      {
        relatedProjectBanner: daSolution
          ? {
              text: 'Learn more about the DA layer here:',
              project: {
                name: daSolution.layerName,
                slug: `${daSolution.layerSlug}/${daSolution.bridgeSlug ?? 'no-bridge'}`,
                type: 'data-availability',
                icon: getProjectIcon(daSolution.layerSlug),
              },
            }
          : undefined,
      },
    ),
  ])
  return {
    type: 'TechnologyChoicesSection',
    props,
  } as const
}
