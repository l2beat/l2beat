import { Project } from '@l2beat/config'
import { formatDate } from '../../../../scripts/chart/ui/dates'

export interface NewsItem {
  title: string
  date: string
  href: string
  domain: string
}

export function getNewsProps(project: Project): NewsItem[] | undefined {
  return project.details.news?.map((x) => ({
    title: x.name,
    href: x.link,
    date: formatDate(x.date),
    domain: new URL(x.link).host,
  }))
}
