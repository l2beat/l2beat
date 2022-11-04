import React from 'react'

import { LinkIcon } from '../icons'
import { OutLink } from '../OutLink'
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
  if (news.length === 0) {
    return null
  }

  return (
    <Section title="News" id="news" className="NewsSection px-4 md:px-0">
      <ul className="NewsSection-List">
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
