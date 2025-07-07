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
        'flex flex-row items-stretch rounded bg-header-secondary',
        size === 'regular' && 'h-16',
        size === 'large' && 'h-[5.125rem]',
        className,
      )}
    >
      <GrissiniStick
        sentiment="neutral"
        className="h-full shrink-0 max-md:w-1"
      />
      <div className={cn('p-4', contentClassName)}>
        <div
          className={cn(
            'mb-1',
            size === 'regular' && 'label-value-14-bold',
            size === 'large' && 'text-sm md:text-lg',
          )}
        >
          {TITLE}
        </div>
        <div
          className={cn('paragraph-12-medium', sentimentToTextColor('neutral'))}
        >
          {DESCRIPTION}
        </div>
      </div>
    </div>
  )
}
