import { Project } from '@l2beat/config'
import { PageMetadata } from '../../../PageMetadata'

export function getPageMetadata(project: Project): PageMetadata {
  return {
    title: `${project.name} – L2BEAT`,
    description: `${project.name} project overview on L2BEAT. In depth layer 2 protocol analysis. Ethereum scaling analytics and research.`,
    image: `https://l2beat.com/meta-images/${project.slug}.png`,
    url: `https://l2beat.com/projects/${project.slug}/`,
  }
}
