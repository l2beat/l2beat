import { Bridge } from '@l2beat/config'

import { NewsSectionProps } from '../../../components/project/NewsSection'
import { formatDate } from '../../../utils'

export function getNewsSection(bridge: Bridge): NewsSectionProps {
  const news =
    bridge.news?.map((x) => ({
      title: x.name,
      href: x.link,
      date: formatDate(x.date),
      domain: new URL(x.link).host,
    })) ?? []
  return { news }
}
