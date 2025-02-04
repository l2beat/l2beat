import { daLayers } from '@l2beat/config'
import type { Bridge, Layer2, Layer3 } from '@l2beat/config'
import { compact } from 'lodash'
import { getDaBridges } from '~/server/features/data-availability/utils/get-da-bridges'
import { getTechnologySectionProps } from './get-technology-section-props'
import { makeTechnologyChoice } from './make-technology-section'

export function getScalingTechnologySection(project: Layer2 | Layer3) {
  const relatedDaProjects = daLayers.filter((project) =>
    getDaBridges(project).some((bridge) =>
      bridge.usedIn.some((usedIn) => usedIn.id === project.id),
    ),
  )

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
          relatedProjectBanner:
            relatedDaProjects.length < 2 && relatedDaProjects[0]
              ? {
                  text: 'Learn more about the DA layer here:',
                  project: {
                    name: relatedDaProjects[0].display.name,
                    slug: `${relatedDaProjects[0].display.slug}/${getDaBridges(relatedDaProjects[0])[0]?.display.slug}`,
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
