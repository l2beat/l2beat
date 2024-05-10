import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'

import { PageMetadata } from '../../../Page'

export function getPageMetadata(
  project: Layer2 | Layer3 | ZkCatalogProject,
): PageMetadata {
  // TODO: Determine correct metadata
  return {
    title: `${project.display.name} – ZK Catalog`,
    description: `${project.display.name} project overview on L2BEAT.`,
    image: `https://l2beat.com/meta-images/projects/${project.display.slug}.png`,
    url: `https://l2beat.com/zk-catalog/${project.display.slug}`,
  }
}
