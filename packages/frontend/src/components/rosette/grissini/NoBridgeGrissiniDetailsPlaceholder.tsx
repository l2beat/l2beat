import { cn } from '~/utils/cn'
import { sentimentToTextColor } from '~/utils/sentiment'
import { GrissiniStick } from './GrissiniStick'

const TITLE = 'No bridge'
const DESCRIPTION =
  'Without a DA Bridge, Ethereum has no proof of data availability for this project.'

export function NoBridgeGrissiniDetailsPlaceholder({
  className,
  contentClassName,
  size = 'regular',
}: {
  className?: string
  contentClassName?: string
  size?: 'large' | 'regular'
}) {
  return (
    <div
      className={cn(
        'flex flex-row items-stretch rounded bg-header-secondary md:h-20.5',
        className,
      )}
    >
      <GrissiniStick
        sentiment="neutral"
        className="h-[unset] shrink-0 self-stretch max-md:w-1"
      />
      <div className={cn('flex flex-col justify-center p-4', contentClassName)}>
        <div
          className={cn(
            'mb-1',
            size === 'regular' && 'font-bold text-label-value-14',
            size === 'large' && 'text-sm md:text-lg',
          )}
        >
          {TITLE}
        </div>
        <div
          className={cn(
            'font-medium text-paragraph-12',
            sentimentToTextColor('neutral'),
          )}
        >
          {DESCRIPTION}
        </div>
      </div>
    </div>
  )
}
