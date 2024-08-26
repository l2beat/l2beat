import {
  type DaBridge,
  type DaLayer,
  type ScalingProjectLinks,
} from '@l2beat/config'
import { compact } from 'lodash'
import { type ProjectLink } from '~/app/_components/projects/links/types'

export function getDataAvailabilityProjectLinks(
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

export function getProjectLinks(
  links: Partial<ScalingProjectLinks>,
): ProjectLink[] {
  return compact([
    links.websites &&
      links.websites.length !== 0 && { name: 'Website', links: links.websites },
    links.apps && links.apps.length !== 0 && { name: 'App', links: links.apps },
    links.documentation &&
      links.documentation.length !== 0 && {
        name: 'Docs',
        links: links.documentation,
      },
    links.explorers &&
      links.explorers.length !== 0 && {
        name: 'Explorer',
        links: links.explorers,
      },
    links.repositories &&
      links.repositories.length !== 0 && {
        name: 'Repository',
        links: links.repositories,
      },
    links.socialMedia &&
      links.socialMedia.length !== 0 && {
        name: 'Social',
        links: links.socialMedia,
      },
    links.rollupCodes && {
      name: 'rollup.codes',
      links: [links.rollupCodes],
    },
  ])
}
