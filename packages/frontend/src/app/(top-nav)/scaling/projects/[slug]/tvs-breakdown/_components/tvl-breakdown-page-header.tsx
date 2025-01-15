import { type WarningWithSentiment } from '@l2beat/config'
import Image from 'next/image'
import { Breadcrumbs } from '~/components/breadcrumbs'
import { type ProjectSevenDayTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'
import { formatTimestampToDateWithHour } from '~/utils/dates'
import { TvlBreakdownSummaryBox } from './tvl-breakdown-summary-box'

interface Props {
  title: string
  slug: string
  tvl: ProjectSevenDayTvlBreakdown
  tvlWarning: WarningWithSentiment | undefined
  tvlBreakdownTimestamp: number
}

export function TvlBreakdownPageHeader({
  title,
  slug,
  tvl,
  tvlWarning,
  tvlBreakdownTimestamp,
}: Props) {
  return (
    <div className="flex flex-col border-divider px-4 pt-6 max-md:border-b max-md:bg-header-primary md:mt-[38px] md:px-0">
      <Breadcrumbs
        className="mb-4"
        items={[
          {
            content: (
              <div className="flex items-center gap-1.5">
                <Image
                  width={16}
                  height={16}
                  src={`/icons/${slug}.png`}
                  alt={`${title} logo`}
                />
                <span className="leading-none">{title}</span>
              </div>
            ),
            href: `/scaling/projects/${slug}`,
          },
          {
            content: 'TVS Breakdown',
          },
        ]}
      />

      <div className="flex flex-col items-start justify-between gap-[10px] md:mb-4 md:flex-row md:items-center">
        <h2 className="text-[28px] font-bold md:text-3xl">TVS Breakdown</h2>
        <div className="text-xs font-medium text-secondary">
          Timestamp:&nbsp;
          <span className="text-base font-medium text-primary">
            {formatTimestampToDateWithHour(tvlBreakdownTimestamp)}
          </span>
        </div>
      </div>

      <TvlBreakdownSummaryBox
        total={{
          value: tvl.breakdown.total,
          change: tvl.change.total,
        }}
        canonical={{
          value: tvl.breakdown.canonical,
          change: tvl.change.canonical,
        }}
        external={{
          value: tvl.breakdown.external,
          change: tvl.change.external,
        }}
        native={{
          value: tvl.breakdown.native,
          change: tvl.change.native,
        }}
        warning={tvlWarning}
      />
    </div>
  )
}
