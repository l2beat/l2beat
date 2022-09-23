import { Bridge } from '@l2beat/config'

import { PageMetadata } from '../../Page'

export function getPageMetadata(project: Bridge): PageMetadata {
  return {
    title: `${project.display.name} – L2BEAT`,
    description: `${project.display.name} project overview on L2BEAT. In depth bridge security analysis. Ethereum scaling analytics and research.`,
    image: `https://l2beat.com/meta-images/${project.display.slug}.png`,
    url: `https://l2beat.com/bridges/projects/${project.display.slug}/`,
  }
}
