import { PlainLink } from '~/components/PlainLink'
import { cn } from '~/utils/cn'
import { formatPublicationDate } from '~/utils/dates'
import type { HomeResearchItem } from '../getHomeResearch'
import {
  HOME_ROW_LINK_CLASS,
  HOME_TEXT,
  HOME_THUMBNAIL_CLASS,
} from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

/** Our latest research, as on the Research tab of /publications. */
export function HomeLatestArticlesCard({
  research,
  className,
}: {
  research: HomeResearchItem[]
  className?: string
}) {
  return (
    <HomeCard className={cn('flex flex-col gap-3', className)}>
      <HomeCardHeader
        title="Latest articles"
        link={{ href: '/publications', label: 'All publications' }}
      />
      <Research items={research} />
    </HomeCard>
  )
}

function Research({ items }: { items: HomeResearchItem[] }) {
  if (items.length === 0) {
    return null
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id}>
          <PlainLink href={item.url} className="group flex items-center gap-3">
            <img
              src={item.thumbnail.src}
              alt=""
              loading="lazy"
              className={HOME_THUMBNAIL_CLASS}
            />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span
                className={cn(
                  'line-clamp-2',
                  HOME_ROW_LINK_CLASS,
                  HOME_TEXT.row,
                  // The row style's line is its font size, too tight to wrap.
                  'leading-5',
                )}
              >
                {item.shortTitle ?? item.title}
              </span>
              <span className={HOME_TEXT.meta}>
                {formatPublicationDate(new Date(item.publishedOn * 1000))}
              </span>
            </span>
          </PlainLink>
        </li>
      ))}
    </ul>
  )
}
