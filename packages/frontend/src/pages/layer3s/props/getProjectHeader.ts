import { layer2s, Layer3, ProjectLinks } from '@l2beat/config'

import { ProjectLink } from '../../../components/icons'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { ProjectHeaderProps } from '../view/ProjectHeader'

export function getProjectHeader(project: Layer3): ProjectHeaderProps {
  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    description: project.display.description,
    purpose: project.display.purpose,
    technology: project.display.category,
    links: getLinks(project.display.links),
    isUpcoming: project.isUpcoming,
    isUnderReview: project.isUnderReview,
    showProjectUnderReview: isAnySectionUnderReview(project),
    warning: project.display.headerWarning,
    hostChain: layer2s.find((l) => l.id === project.hostChain)?.display.name,
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
