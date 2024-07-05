import { type DaLayer } from '@l2beat/config'
import { compact } from 'lodash'
import { type ProjectLink } from '~/app/_components/projects/links/types'

export function getProjectLinks(
  links: DaLayer['display']['links'],
): ProjectLink[] {
  return compact([
    links.websites.length !== 0 && { name: 'Website', links: links.websites },
    links.documentation.length !== 0 && {
      name: 'Docs',
      links: links.documentation,
    },
    links.repositories.length !== 0 && {
      name: 'Repository',
      links: links.repositories,
    },
  ])
}
