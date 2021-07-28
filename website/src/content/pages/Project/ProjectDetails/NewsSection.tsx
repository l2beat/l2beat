import { OutLink } from '../../../common'
import { LinkIcon } from '../../../common/icons'
import { NewsItem } from '../props'
import { Section } from './Section'

interface Props {
  news: NewsItem[]
}

export function NewsSection({ news }: Props) {
  return (
    <Section title="News">
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
