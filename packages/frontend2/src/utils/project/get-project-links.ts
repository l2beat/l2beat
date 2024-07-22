import { type DaBridge, type DaLayer } from '@l2beat/config'
import { compact } from 'lodash'
import { type ProjectLink } from '~/app/_components/projects/links/types'

export function getProjectLinks(
  daLayerLinks: DaLayer['display']['links'],
  daBridgeLinks: DaBridge['display']['links'],
): ProjectLink[] {
  const websites = [...daLayerLinks.websites, ...daBridgeLinks.websites]
  const documentation = [
    ...daLayerLinks.documentation,
    ...daBridgeLinks.documentation,
  ]
  const repositories = [
    ...daLayerLinks.repositories,
    ...daBridgeLinks.repositories,
  ]

  return compact([
    websites.length !== 0 && {
      name: 'Website',
      links: websites,
    },
    documentation.length !== 0 && {
      name: 'Docs',
      links: documentation,
    },
    repositories.length !== 0 && {
      name: 'Repository',
      links: repositories,
    },
  ])
}
