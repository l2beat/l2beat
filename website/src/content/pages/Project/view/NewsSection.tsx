import { OutLink } from '../../../common'
import { LinkIcon } from '../../../common/icons'
import { Section } from './Section'

export interface NewsSectionProps {
  news: NewsItem[]
}

export interface NewsItem {
  title: string
  date: string
  href: string
  domain: string
}

export function NewsSection({ news }: NewsSectionProps) {
  return (
    <Section title="News" id="news">
      <ul className="NewsSection">
        {news.map((news, i) => (
          <li key={i}>
            <OutLink className="NewsSection-News" href={news.href}>
              <div className="NewsSection-Source">
                <span>{news.date}</span> &middot; <span>{news.domain}</span>
              </div>
              <div className="NewsSection-Title">{news.title}</div>
              <LinkIcon className="NewsSection-Icon" />
            </OutLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}
