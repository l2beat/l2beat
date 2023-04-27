import { Bridge, ProjectLinks } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared'

import { ProjectLink } from '../../../components/icons'
import { getDestination } from '../../../utils/getDestination'
import { getTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { ProjectHeaderProps } from '../view/ProjectHeader'

export function getProjectHeader(
  project: Bridge,
  tvlApiResponse: TvlApiResponse,
): ProjectHeaderProps {
  const charts = tvlApiResponse.projects[project.id.toString()]?.charts
  const { tvl, tvlWeeklyChange } = getTvlWithChange(charts)

  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    tvl: formatUSD(tvl),
    tvlWeeklyChange,
    destination: getDestination(project.technology.destination),
    validatedBy: project.riskView?.validatedBy,
    type: project.technology.category,
    isArchived: project.isArchived,
    isUpcoming: project.isUpcoming,
    links: getLinks(project.display.links),
  }
}

function getLinks(links: Partial<ProjectLinks>) {
  const projectLinks: ProjectLink[] = []

  if (links.websites) {
    projectLinks.push({
      name: 'Website',
      links: links.websites,
    })
  }

  if (links.apps) {
    projectLinks.push({
      name: 'App',
      links: links.apps,
    })
  }

  if (links.documentation) {
    projectLinks.push({
      name: 'Documentation',
      links: links.documentation,
    })
  }

  if (links.explorers) {
    projectLinks.push({
      name: 'Explorer',
      links: links.explorers,
    })
  }

  if (links.repositories) {
    projectLinks.push({
      name: 'Repository',
      links: links.repositories,
    })
  }

  if (links.socialMedia) {
    projectLinks.push({
      name: 'Social',
      links: links.socialMedia,
    })
  }

  return projectLinks.filter((link) => link.links.length > 0)
}
