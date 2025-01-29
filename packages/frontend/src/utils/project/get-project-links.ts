import { type DaLayer, type ProjectLinks } from '@l2beat/config'
import { compact } from 'lodash'
import { type ProjectLink } from '~/components/projects/links/types'

export function getDataAvailabilityProjectLinks(
  daLayer: DaLayer,
): ProjectLink[] {
  const websites = [
    ...(daLayer.display.links.websites ?? []),
    ...daLayer.bridges.flatMap((b) => b.display.links.websites ?? []),
  ]
  const apps = [
    ...(daLayer.display.links.apps ?? []),
    ...daLayer.bridges.flatMap((b) => b.display.links.apps ?? []),
  ]
  const documentation = [
    ...(daLayer.display.links.documentation ?? []),
    ...daLayer.bridges.flatMap((b) => b.display.links.documentation ?? []),
  ]
  const explorers = [
    ...(daLayer.display.links.explorers ?? []),
    ...daLayer.bridges.flatMap((b) => b.display.links.explorers ?? []),
  ]
  const repositories = [
    ...(daLayer.display.links.repositories ?? []),
    ...daLayer.bridges.flatMap((b) => b.display.links.repositories ?? []),
  ]
  const socials = [
    ...(daLayer.display.links.socialMedia ?? []),
    ...daLayer.bridges.flatMap((b) => b.display.links.socialMedia ?? []),
  ]

  return compact([
    websites.length !== 0 && { name: 'Website', links: websites },
    apps.length !== 0 && { name: 'App', links: apps },
    documentation.length !== 0 && { name: 'Docs', links: documentation },
    explorers.length !== 0 && { name: 'Explorer', links: explorers },
    repositories.length !== 0 && { name: 'Repository', links: repositories },
    socials.length !== 0 && { name: 'Social', links: socials },
  ])
}

export function getProjectLinks(links: ProjectLinks): ProjectLink[] {
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
