import { ZkCatalogProject } from '@l2beat/config'

import { PageMetadata } from '../../../Page'

export function getPageMetadata(project: ZkCatalogProject): PageMetadata {
  // TODO: Determine correct metadata
  return {
    title: `${project.display.name} – L2BEAT`,
    description: `${project.display.name} project overview on L2BEAT.`,
    image: `https://l2beat.com/meta-images/projects/${project.display.slug}.png`,
    url: `https://l2beat.com/scaling/projects/${project.display.slug}/`,
  }
}
