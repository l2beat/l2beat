import Image from 'next/image'
import { formatTimestampToDateWithHour } from '~/utils/dates'

interface Props {
  title: string
  slug: string
  tvlBreakdownTimestamp: number
}

export function TvlBreakdownPageHeader({
  title,
  slug,
  tvlBreakdownTimestamp,
}: Props) {
  return (
    <div className="mt-11 flex flex-col px-4 md:px-0">
      <div className={'flex items-center gap-1.5'}>
        <Image
          width={16}
          height={16}
          src={`/icons/${slug}.png`}
          alt={`${title} logo`}
        />
        <h1 className="text-base font-medium">
          <a href={`/scaling/projects/${slug}`}>{title}</a>
          <span className="mx-1 text-gray-550">/</span>
          TVS Breakdown
        </h1>
      </div>

      <div className="my-4 flex flex-col items-start justify-between gap-[10px] md:mt-[38px] md:flex-row md:items-center">
        <h2 className="text-[28px] font-bold md:text-3xl">TVS Breakdown</h2>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-550">
          Timestamp:&nbsp;
          <span className="text-base font-medium text-primary">
            {formatTimestampToDateWithHour(tvlBreakdownTimestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}
