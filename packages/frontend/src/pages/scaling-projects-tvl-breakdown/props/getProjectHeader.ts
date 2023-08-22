import { Layer2 } from '@l2beat/config'
import { ProjectHeaderProps } from '../view/ProjectHeader'

export function getProjectHeader(project: Layer2): ProjectHeaderProps {
  const date = new Date()
  const month = date.getMonth() + 1
  const tvlBreakdownDate = `${date.getFullYear()}-${
    month.toString().length === 1 ? `0${month}` : month
  }-${date.getDate()}`

  return {
    icon: `/icons/${project.display.slug}.png`,
    slug: project.display.slug,
    title: project.display.name,
    tvlBreakdownHref: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
    tvlBreakdownDate,
  }
}
