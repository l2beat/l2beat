import { Project } from '@l2beat/config'
import { PageMetadata } from '../../../PageMetadata'

export function getPageMetadata(project: Project): PageMetadata {
  return {
    title: `${project.name} – L2BEAT`,
    description: `${project.name} project on L2BEAT. Layer 2 scaling analytics and research.`,
    image: `https://l2beat.com/meta-images/${project.slug}.png`,
    url: `https://l2beat.com/projects/${project.slug}/`,
  }
}
