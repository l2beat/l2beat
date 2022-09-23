import { Layer2 } from '@l2beat/config'

import { NewsSectionProps } from '../../../components/project/NewsSection'
import { formatDate } from '../../../utils'

export function getNewsSection(project: Layer2): NewsSectionProps {
  const news = project.news.map((x) => ({
    title: x.name,
    href: x.link,
    date: formatDate(x.date),
    domain: new URL(x.link).host,
  }))
  return { news }
}
