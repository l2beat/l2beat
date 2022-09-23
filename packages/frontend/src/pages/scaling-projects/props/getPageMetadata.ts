import { Layer2 } from '@l2beat/config'

import { PageMetadata } from '../../Page'

export function getPageMetadata(project: Layer2): PageMetadata {
  return {
    title: `${project.display.name} – L2BEAT`,
    description: `${project.display.name} project overview on L2BEAT. In depth layer 2 protocol analysis. Ethereum scaling analytics and research.`,
    image: `https://l2beat.com/meta-images/${project.display.slug}.png`,
    url: `https://l2beat.com/scaling/projects/${project.display.slug}/`,
  }
}
