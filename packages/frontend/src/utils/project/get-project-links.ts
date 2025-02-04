import type { ProjectLinks } from '@l2beat/config'
import { compact } from 'lodash'
import type { ProjectLink } from '~/components/projects/links/types'

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
