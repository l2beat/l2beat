import { Bridge, Layer2, Layer3 } from '@l2beat/config'

import { PageMetadata } from '../../Page'

export function getPageMetadata(
  project: Layer2 | Layer3 | Bridge,
): PageMetadata {
  const scalingOrBridges = project.type === 'bridge' ? 'bridges' : 'scaling'
  return {
    title: `${project.display.name} – L2BEAT`,
    description: `${project.display.name} project overview on L2BEAT. ${project.display.description}`,
    image: `https://l2beat.com/meta-images/projects/${project.display.slug}.png`,
    url: `https://l2beat.com/${scalingOrBridges}/projects/${project.display.slug}/`,
  }
}
