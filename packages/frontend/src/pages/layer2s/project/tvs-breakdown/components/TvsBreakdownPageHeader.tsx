import { Breadcrumbs } from '~/components/Breadcrumbs'
import { UtcDateTime } from '~/components/core/UtcDateTime'
import { SearchBarButton } from '~/components/search-bar/SearchBarButton'

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
              href: `/layer2s/projects/${slug}`,
            },
            {
              content: 'TVS breakdown',
            },
          ]}
        />
        <SearchBarButton className="max-lg:hidden" />
      </div>

      <div className="flex flex-col items-start justify-between gap-[10px] md:mb-4 md:flex-row md:items-center">
        <h1 className="font-bold text-[26px]">TVS breakdown</h1>
        <p className="font-normal text-label-value-13 text-secondary">
          Data as of <UtcDateTime timestamp={tvsBreakdownTimestamp} />
        </p>
      </div>
    </div>
  )
}
