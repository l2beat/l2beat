import { ScalingProjectLinks } from '@l2beat/config'

import { ProjectLink } from '../types'

export function getLinks(links: Partial<ScalingProjectLinks>): ProjectLink[] {
  const items = [
    { name: 'Website', links: links.websites ?? [] },
    { name: 'App', links: links.apps ?? [] },
    { name: 'Docs', links: links.documentation ?? [] },
    { name: 'Explorer', links: links.explorers ?? [] },
    { name: 'Repository', links: links.repositories ?? [] },
    { name: 'Social', links: links.socialMedia ?? [] },
    {
      name: 'rollup.codes',
      links: links.rollupCodes ? [links.rollupCodes] : [],
    },
  ]

  return items.filter((link) => link.links.length > 0)
}
