import { Breadcrumbs } from '~/components/Breadcrumbs'
import { SearchBarButton } from '~/components/search-bar/SearchBarButton'
import { formatTimestampToDateWithHour } from '~/utils/dates'

interface Props {
  title: string
  slug: string
  icon: string
  tvsBreakdownTimestamp: number
}

export function TvsBreakdownPageHeader({
  title,
  slug,
  icon,
  tvsBreakdownTimestamp,
}: Props) {
  return (
    <div className="flex flex-col border-divider px-4 py-6 max-md:mt-px max-md:border-b max-md:bg-header-primary md:px-0">
      <div className="mb-4 flex items-center justify-between">
        <Breadcrumbs
          items={[
            {
              content: (
                <div className="flex items-center gap-1.5">
                  <img
                    width={16}
                    height={16}
                    src={icon}
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
        <SearchBarButton className="max-lg:hidden" label="Search projects" />
      </div>

      <div className="flex flex-col items-start justify-between gap-[10px] md:mb-4 md:flex-row md:items-center">
        <h2 className="font-bold text-[28px] md:text-3xl">TVS Breakdown</h2>
        <div className="font-medium text-secondary text-xs">
          Timestamp:&nbsp;
          <span className="font-medium text-base text-primary">
            {formatTimestampToDateWithHour(tvsBreakdownTimestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}
