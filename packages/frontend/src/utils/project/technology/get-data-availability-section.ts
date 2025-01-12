import { type Layer2, type Layer3 } from '@l2beat/config'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { type ProjectDetailsSection } from '~/components/projects/sections/types'
import { getDaRisks } from '~/server/features/data-availability/utils/get-da-risks'
import { toTechnologyRisk } from '../risk-summary/to-technology-risk'

export function getDataAvailabilitySection(project: Layer2 | Layer3) {
  if (!project.dataAvailabilitySolution) {
    return
  }

  const daSubsections: ProjectDetailsSection[] = []

  const evaluatedRisks = getDaRisks(
    project.dataAvailabilitySolution,
    project.dataAvailabilitySolution.bridge,
    0, // TODO: getTVL
  )

  const layerGrissiniValues = mapLayerRisksToRosetteValues(evaluatedRisks)
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(evaluatedRisks)

  const evaluatedGrissiniValues = [
    ...layerGrissiniValues,
    ...bridgeGrissiniValues,
  ]

  daSubsections.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-layer-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: !!project.dataAvailabilitySolution.isUnderReview,
      isVerified: false, // TODO: project.dataAvailabilitySolution.isVerified,
      grissiniValues: evaluatedGrissiniValues,
    },
  })

  daSubsections.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: {
        type: 'da-layer-technology',
        slug: project.dataAvailabilitySolution.display.slug,
      },
      content: project.dataAvailabilitySolution.technology.description.concat(
        '\n\n',
        project.dataAvailabilitySolution.bridge.technology.description,
      ),
      mdClassName:
        'da-beat text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
      risks: project.dataAvailabilitySolution.technology.risks
        ?.concat(project.dataAvailabilitySolution.bridge.technology.risks ?? [])
        .map(toTechnologyRisk),
      references:
        project.dataAvailabilitySolution.technology.references?.concat(
          ...(project.dataAvailabilitySolution.bridge.technology.references ??
            []),
        ),
    },
  })

  return daSubsections
}
