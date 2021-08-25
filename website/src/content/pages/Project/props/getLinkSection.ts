import { Project } from '@l2beat/config'
import { LinkSectionProps } from '../view/links/LinkSection'

export function getLinkSection(project: Project): LinkSectionProps {
  return {
    links: project.details.links,
    name: project.name,
    icon: `/icons/${project.slug}.png`,
  }
}
