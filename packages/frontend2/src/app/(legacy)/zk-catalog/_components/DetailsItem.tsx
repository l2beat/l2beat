import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import InfoIcon from '~/icons/info.svg'
import { cn } from '~/utils/cn'

export function DetailsItem({
  title,
  children,
  className,
  tooltip,
}: {
  title: string
  children: React.ReactNode
  className?: string
  tooltip?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="flex items-center gap-1.5 font-semibold text-2xs text-gray-500 uppercase">
        {title}
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="fill-current md:size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div className="font-bold text-lg">{children}</div>
    </div>
  )
}
