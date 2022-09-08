import { Layer2 } from '@l2beat/config'

import { LinkSectionProps } from '../view/links/LinkSection'

export function getLinkSection(project: Layer2): LinkSectionProps {
  return {
    links: project.details.links,
    name: project.name,
    icon: `/icons/${project.slug}.png`,
  }
}
