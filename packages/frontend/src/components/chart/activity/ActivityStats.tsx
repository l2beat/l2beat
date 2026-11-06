import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import { InfoIcon } from '~/icons/Info'
import { HomeChange } from '~/pages/home/components/HomeChange'
import {
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_TEXT,
} from '~/pages/home/homeStyles'
import { cn } from '~/utils/cn'

interface ActivityStat {
  label: string
  tooltip?: string
  /** Undefined without data */
  value: ReactNode
}

/**
 * The section's figures as the home page shows them: the headline one large
 * with its change, the rest as rows
 */
export function ActivityStats({
  headline,
  rows,
  isLoading,
}: {
  headline: ActivityStat & {
    /** Ratio, e.g. 0.12 for +12% */
    change?: number
    /** What the change compares to, e.g. "7d" */
    changePeriod?: string
  }
  rows: (ActivityStat & {
    /** Small print after the value, e.g. its date */
    note?: string
  })[]
  isLoading: boolean
}) {
  return (
    <div className="mt-6 grid gap-x-10 gap-y-4 border-divider border-t pt-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="flex flex-col gap-2">
        <Label stat={headline} />
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <span className="flex items-baseline gap-x-2 whitespace-nowrap">
            <span className={HOME_TEXT.number}>
              {headline.value ?? EM_DASH}
            </span>
            {headline.value !== undefined &&
              headline.change !== undefined &&
              Number.isFinite(headline.change) && (
                <span className="flex items-baseline gap-1 font-medium text-label-value-13">
                  <HomeChange value={headline.change} />
                  {headline.changePeriod && (
                    <span className="text-secondary">
                      {headline.changePeriod}
                    </span>
                  )}
                </span>
              )}
          </span>
        )}
      </div>
      <ul className={HOME_ROW_LINES_CLASS}>
        {rows.map((row) => (
          <li
            key={row.label}
            className={cn(
              'flex items-center justify-between gap-4',
              HOME_ROW_CLASS,
            )}
          >
            <Label stat={row} className="text-label-value-15" />
            {isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                {row.value !== undefined && row.note && (
                  <span className={HOME_TEXT.meta}>{row.note}</span>
                )}
                <span className={HOME_TEXT.value}>{row.value ?? EM_DASH}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Label({
  stat,
  className,
}: {
  stat: ActivityStat
  className?: string
}) {
  return (
    <span
      className={cn('flex items-center gap-1.5', HOME_TEXT.meta, className)}
    >
      {stat.label}
      {stat.tooltip && (
        <Tooltip>
          <TooltipTrigger aria-label="More info">
            <InfoIcon className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent>{stat.tooltip}</TooltipContent>
        </Tooltip>
      )}
    </span>
  )
}
