import { Layer2 } from '@l2beat/config'

import { LinkSectionProps } from '../../../components/project/links/LinkSection'

export function getLinkSection(project: Layer2): LinkSectionProps {
  return {
    links: project.display.links,
    name: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
  }
}
