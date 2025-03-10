import { type Project } from '@l2beat/config'
import { compact } from 'lodash'
import { ps } from '~/server/projects'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export async function getScalingTechnologySection(
  project: Project<'statuses' | 'scalingTechnology', 'scalingDa'>,
) {
  const layerId = project.scalingDa?.layer.projectId
  const bridgeId = project.scalingDa?.bridge.projectId

  // TODO: having those slugs in config would be easier
  const [layer, bridge] = await Promise.all([
    layerId && ps.getProject({ id: layerId }),
    bridgeId && ps.getProject({ id: bridgeId }),
  ])

  const items = compact([
    project.scalingTechnology.stateCorrectness &&
      makeTechnologyChoice(
        'state-correctness',
        project.scalingTechnology.stateCorrectness,
      ),
    project.scalingTechnology.newCryptography &&
      makeTechnologyChoice(
        'new-cryptography',
        project.scalingTechnology.newCryptography,
      ),
    project.scalingTechnology.dataAvailability &&
      makeTechnologyChoice(
        'data-availability',
        project.scalingTechnology.dataAvailability,
        {
          relatedProjectBanner: layer
            ? {
                text: 'Learn more about the DA layer here:',
                project: {
                  name: layer.name,
                  slug: `${layer.slug}/${bridge?.slug ?? 'no-bridge'}`,
                  type: 'data-availability',
                },
              }
            : undefined,
        },
      ),
  ])

  return getTechnologySectionProps(project, items)
}

export function getBridgeTechnologySection(
  project: Project<'statuses' | 'bridgeTechnology'>,
) {
  const items = compact([
    project.bridgeTechnology.principleOfOperation &&
      makeTechnologyChoice(
        'principle-of-operation',
        project.bridgeTechnology.principleOfOperation,
      ),
    project.bridgeTechnology.validation &&
      makeTechnologyChoice('validation', project.bridgeTechnology.validation),
    project.bridgeTechnology.destinationToken &&
      makeTechnologyChoice(
        'destination-token',
        project.bridgeTechnology.destinationToken,
      ),
  ])

  if (items.length === 0) {
    return undefined
  }

  return {
    items,
    isUnderReview:
      items.every((x) => x.isUnderReview) || project.statuses.isUnderReview,
  }
}
