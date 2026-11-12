import { formatCurrency } from '@l2beat/shared-pure'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import {
  HOME_ICON_CLASS,
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_TEXT,
} from '../../homeStyles'
import { HomeRank, HomeRankedName } from '../HomeRankedTable'

/** Five, like every ranking on the page; stacked, fewer if the height is short. */
const TOP_COUNT = 5

export interface InteropTopListRow {
  id: string
  name: string
  href: string | undefined
  iconUrl: string
  volume: number | null
}

/** The busiest protocols or tokens over the last 24h, ranked like the other cards. */
export function InteropTopList({
  title,
  rows,
  className,
}: {
  title: string
  rows: InteropTopListRow[]
  className?: string
}) {
  if (rows.length === 0) {
    return null
  }
  return (
    <div
      className={cn(
        'flex interop-corners:hidden interop-stacked:min-h-0 min-w-0 interop-stacked:flex-1 interop-stacked:basis-0 flex-col gap-2 interop-stacked:overflow-hidden',
        className,
      )}
    >
      {/* A header row like the ranked tables': the title over the names, the
          value's header over its column. */}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={HOME_TEXT.sectionTitle}>{title}</h3>
        <span className={HOME_TEXT.meta}>Volume</span>
      </div>
      {/* Stacked from lg, the list takes the height left and shows as many
          whole rows as fit. */}
      <ol
        className={cn(
          'interop-stacked:home-fill-rows interop-stacked:min-h-0 interop-stacked:flex-1 interop-stacked:basis-0 interop-stacked:overflow-hidden',
          HOME_ROW_LINES_CLASS,
        )}
      >
        {rows
          .slice(0, TOP_COUNT)
          .map(({ id, name, href, iconUrl, volume }, index) => (
            <li
              key={id}
              className={cn(
                // The ranked tables' gaps, so stacked under them on phones the
                // icons and names line up.
                'flex w-full items-center gap-4',
                HOME_ROW_CLASS,
              )}
            >
              <HomeRank rank={index + 1} />
              {href ? (
                <HomeRankedName
                  name={name}
                  href={href}
                  iconUrl={iconUrl}
                  className="flex-1"
                />
              ) : (
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <img src={iconUrl} alt="" className={HOME_ICON_CLASS} />
                  <span className={cn('truncate', HOME_TEXT.row)}>{name}</span>
                </span>
              )}
              <span className={cn('shrink-0', HOME_TEXT.value)}>
                {volume === null ? EM_DASH : formatCurrency(volume, 'usd')}
              </span>
            </li>
          ))}
      </ol>
    </div>
  )
}
