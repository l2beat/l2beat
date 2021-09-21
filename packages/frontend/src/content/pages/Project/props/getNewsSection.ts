import { Project } from '@l2beat/config'

import { formatDate } from '../../../../scripts/chart/ui/dates'
import { NewsSectionProps } from '../view/NewsSection'

export function getNewsSection(project: Project): NewsSectionProps {
  const news = project.details.news.map((x) => ({
    title: x.name,
    href: x.link,
    date: formatDate(x.date),
    domain: new URL(x.link).host,
  }))
  return { news }
}
