import { Bridge } from '@l2beat/config'

import { LinkSectionProps } from '../../../components/project/links/LinkSection'

export function getLinkSection(bridge: Bridge): LinkSectionProps {
  return {
    links: {
      apps: bridge.display.links.apps ?? [],
      documentation: bridge.display.links.documentation ?? [],
      explorers: bridge.display.links.explorers ?? [],
      repositories: bridge.display.links.repositories ?? [],
      socialMedia: bridge.display.links.socialMedia ?? [],
      websites: bridge.display.links.websites ?? [],
    },
    name: bridge.display.name,
    icon: `/icons/${bridge.display.slug}.png`,
  }
}
