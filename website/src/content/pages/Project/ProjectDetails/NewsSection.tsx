import { News } from '@l2beat/config'
import { formatDate } from '../../../../scripts/chart/ui/dates'
import { OutLink } from '../../../common'
import { Section } from './Section'

interface Props {
  news: News[]
}

export function NewsSection({ news }: Props) {
  return (
    <Section title="News">
      <ul className="ProjectDetails-Links">
        {news.map((news, i) => (
          <li key={i}>
            {/* TODO: date formatting should be done already */}
            {formatDate(news.date)} &ndash;{' '}
            <OutLink href={news.link}>{news.name}</OutLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}
