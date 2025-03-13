import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import type { GroupSectionProps } from '~/components/projects/sections/group-section'
import type { TechnologySectionProps } from '~/components/projects/sections/technology-section'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { DaSolution } from '~/server/features/scaling/project/get-scaling-da-solution'
import { toTechnologyRisk } from '../risk-summary/to-technology-risk'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

type DataAvailabilitySection =
  | {
      type: 'Group'
      props: Omit<GroupSectionProps, 'id' | 'title' | 'sectionOrder'>
    }
  | {
      type: 'TechnologySection'
      props: Omit<TechnologySectionProps, 'id' | 'title' | 'sectionOrder'>
    }

export function getDataAvailabilitySection(
  project: Project<'statuses', 'customDa' | 'scalingTechnology' | 'scalingDa'>,
  daSolution?: DaSolution,
): DataAvailabilitySection | undefined {
  if (project.customDa) {
    return getCustomDaSection(project)
  }
  if (project.scalingTechnology?.dataAvailability) {
    return getTechnologySection(
      {
        ...project,
        scalingTechnology: project.scalingTechnology,
      },
      daSolution,
    )
  }
}

function getCustomDaSection(
  project: Project<'statuses', 'customDa'>,
): Extract<DataAvailabilitySection, { type: 'Group' }> {
  assert(project.customDa, 'customDa is required')
  const daSubsections: ProjectDetailsSection[] = []

  const layerGrissiniValues = mapLayerRisksToRosetteValues(
    project.customDa.risks,
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
      diagram: {
        type: 'da-layer-technology',
        slug: project.slug,
      },
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
      isUnderReview: project.statuses.isUnderReview,
    },
  }
}

function getTechnologySection(
  project: Project<'statuses' | 'scalingTechnology', 'scalingDa'>,
  daSolution?: DaSolution,
): Extract<DataAvailabilitySection, { type: 'TechnologySection' }> | undefined {
  assert(
    project.scalingTechnology?.dataAvailability,
    'dataAvailability is required',
  )

  const props = getTechnologySectionProps(project, [
    makeTechnologyChoice(
      'data-availability',
      project.scalingTechnology.dataAvailability,
      {
        relatedProjectBanner: daSolution
          ? {
              text: 'Learn more about the DA layer here:',
              project: {
                name: daSolution.layerName,
                slug: `${daSolution.layerName}/${daSolution.bridgeSlug ?? 'no-bridge'}`,
                type: 'data-availability',
              },
            }
          : undefined,
      },
    ),
  ])
  if (!props) {
    return undefined
  }
  return {
    type: 'TechnologySection',
    props,
  }
}
