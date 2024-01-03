import { layer2s, Layer3, ProjectLinks } from '@l2beat/config'

import { ProjectLink } from '../../../components/icons'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { ProjectHeaderProps } from '../view/ProjectHeader'

export function getProjectHeader(project: Layer3): ProjectHeaderProps {
  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    titleLength: getTitleLength(project.display.name),
    purpose: project.display.purpose,
    technology: project.display.category,
    links: getLinks(project.display.links),
    isArchived: project.isArchived,
    isUpcoming: project.isUpcoming,
    isUnderReview: project.isUnderReview,
    showProjectUnderReview: isAnySectionUnderReview(project),
    warning: project.display.headerWarning,
    hostChain: layer2s.find((l) => l.id === project.hostChain)?.display.name,
  }
}

function getTitleLength(name: string): 'long' | 'very-long' | undefined {
  switch (name) {
    case 'Optimism':
    case 'rhino.fi':
    case 'Immutable X':
      return 'long'
    case 'OMG Network':
    case 'Layer2.Finance':
    case 'ZKSwap V2':
    case 'Polygon Hermez':
    case 'Metis Andromeda':
      return 'very-long'
  }
}

function getLinks(links: ProjectLinks): ProjectLink[] {
  const items = [
    {
      name: 'Website',
      links: links.websites,
    },
    {
      name: 'App',
      links: links.apps,
    },
    {
      name: 'Docs',
      links: links.documentation,
    },
    {
      name: 'Explorer',
      links: links.explorers,
    },
    {
      name: 'Repository',
      links: links.repositories,
    },
    {
      name: 'Social',
      links: links.socialMedia,
    },
    {
      name: 'rollup.codes',
      links: links.rollupCodes ? [links.rollupCodes] : [],
    },
  ] as const

  return items.filter((link) => link.links.length > 0)
}
