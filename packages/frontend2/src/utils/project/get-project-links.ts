import { type DaBridge, type DaLayer } from '@l2beat/config'
import { compact } from 'lodash'
import { type ProjectLink } from '~/app/_components/projects/links/types'

export function getProjectLinks(
  daLayerLinks: DaLayer['display']['links'],
  daBridgeLinks: DaBridge['display']['links'],
): ProjectLink[] {
  const websites = [...daLayerLinks.websites, ...daBridgeLinks.websites]
  const apps = [...daLayerLinks.apps, ...daBridgeLinks.apps]
  const documentation = [
    ...daLayerLinks.documentation,
    ...daBridgeLinks.documentation,
  ]
  const explorers = [...daLayerLinks.explorers, ...daBridgeLinks.explorers]
  const repositories = [
    ...daLayerLinks.repositories,
    ...daBridgeLinks.repositories,
  ]
  const socials = [...daLayerLinks.socialMedia, ...daBridgeLinks.socialMedia]

  return compact([
    websites.length !== 0 && { name: 'Website', links: websites },
    apps.length !== 0 && { name: 'App', links: apps },
    documentation.length !== 0 && { name: 'Docs', links: documentation },
    explorers.length !== 0 && { name: 'Explorer', links: explorers },
    repositories.length !== 0 && { name: 'Repository', links: repositories },
    socials.length !== 0 && { name: 'Social', links: socials },
  ])
}
