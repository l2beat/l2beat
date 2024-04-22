import { Layer2 } from '@l2beat/config'

import { PageMetadata } from '../../../Page'

export function getPageMetadata(project: Layer2): PageMetadata {
  return {
    title: `${project.display.name} | Changelog – L2BEAT`,
    description: `${project.display.name} changelog overview on L2BEAT.`,
    image: `https://l2beat.com/meta-images/projects/${project.display.slug}.png`,
    url: `https://l2beat.com/scaling/projects/${project.display.slug}/changelog`,
  }
}
