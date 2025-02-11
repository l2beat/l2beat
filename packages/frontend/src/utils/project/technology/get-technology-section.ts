import type { Bridge, Layer2, Layer3 } from '@l2beat/config'
import { compact } from 'lodash'
import { ps } from '~/server/projects'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export async function getScalingTechnologySection(project: Layer2 | Layer3) {
  const layerId = project.dataAvailability?.layer.projectId
  const bridgeId = project.dataAvailability?.bridge.projectId

  // TODO: having those slugs in config would be easier
  const [layer, bridge] = await Promise.all([
    layerId && ps.getProject({ id: layerId }),
    bridgeId && ps.getProject({ id: bridgeId }),
  ])

  const items = compact([
    project.technology.stateCorrectness &&
      makeTechnologyChoice(
        'state-correctness',
        project.technology.stateCorrectness,
      ),
    project.technology.newCryptography &&
      makeTechnologyChoice(
        'new-cryptography',
        project.technology.newCryptography,
      ),
    project.technology.dataAvailability &&
      makeTechnologyChoice(
        'data-availability',
        project.technology.dataAvailability,
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

export function getBridgeTechnologySection(project: Bridge) {
  const items = compact([
    project.technology.principleOfOperation &&
      makeTechnologyChoice(
        'principle-of-operation',
        project.technology.principleOfOperation,
      ),
    project.technology.validation &&
      makeTechnologyChoice('validation', project.technology.validation),
    project.technology.destinationToken &&
      makeTechnologyChoice(
        'destination-token',
        project.technology.destinationToken,
      ),
  ])

  return getTechnologySectionProps(project, items)
}
