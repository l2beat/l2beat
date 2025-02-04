import type { Milestone } from '@l2beat/config'
import { CustomLink } from '~/components/link/custom-link'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { formatDate } from '~/utils/dates'

interface Props {
  milestone: Milestone
}

export function ChartMilestoneHover({ milestone }: Props) {
  const isMobile = useIsMobile()
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatDate(milestone.date.slice(0, 10))}
      </div>
      <div className="mb-2 flex max-w-[216px] flex-wrap font-bold">
        {milestone.type === 'incident' ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="absolute mt-[2px] fill-red-800 stroke-red-700 md:mt-1"
            role="img"
          >
            <path
              d="M2.11842 14.4966L9.13637 2.46527C9.52224 1.80374 10.4781 1.80375 10.864 2.46528L17.882 14.497C18.2708 15.1637 17.7899 16.0008 17.0182 16.0008L10.0003 16.0008L10.0002 16.0008L2.98214 16.0004C2.21039 16.0004 1.72956 15.1632 2.11842 14.4966Z"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <div className="absolute mt-[2px] size-2.5 rotate-45 border-2 border-green-500 bg-green-700 md:mt-1"></div>
        )}
        <span className="ml-4 text-left">{milestone.title}</span>
      </div>
      <div className="mb-1 max-w-[216px] text-left">
        {milestone.description}
      </div>
      {isMobile && <CustomLink href={milestone.url}>Learn more</CustomLink>}
    </div>
  )
}
