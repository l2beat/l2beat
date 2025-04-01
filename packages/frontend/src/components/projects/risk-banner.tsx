import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import {
  sentimentToTextColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'
import { Markdown } from '../markdown/markdown'
import { GrissiniStick } from '../rosette/grissini/grissini-stick'
import type { RosetteValue } from '../rosette/types'
import { WarningBar, sentimentToWarningBarColor } from '../warning-bar'

interface RiskBannerProps extends RosetteValue {
  className?: string
  size?: 'small' | 'regular'
  descriptionAsTooltip?: boolean
}

export function RiskBanner({
  name,
  sentiment,
  value,
  warning,
  description,
  className,
  size = 'regular',
  descriptionAsTooltip,
}: RiskBannerProps) {
  const adjSentiment = sentiment ?? 'neutral'
  const content = (
    <div>
      <div
        className={cn(
          'flex flex-row items-stretch rounded-lg',
          size === 'small' && 'h-12',
          size === 'regular' && 'h-12 md:h-[5.125rem]',
          sentimentToTransparentBgColor(adjSentiment),
          warning && 'rounded-b-none',
          className,
        )}
      >
        <GrissiniStick
          sentiment={adjSentiment}
          className={cn(
            'h-full shrink-0 max-md:w-1',
            warning && 'rounded-b-none',
            className,
          )}
        />
        <div className="flex flex-1 flex-col items-start justify-center gap-1 p-4">
          <div className="text-3xs font-semibold uppercase md:text-2xs">
            {name}
          </div>
          <div
            className={cn(
              'text-sm font-bold !leading-none md:text-lg',
              sentimentToTextColor(adjSentiment, { vibrant: true }),
            )}
          >
            {value}
          </div>
        </div>
      </div>
      {warning && (
        <div className="relative">
          <GrissiniStick
            className={cn(
              'absolute inset-y-0 left-0 h-full shrink-0 rounded-t-none max-md:w-1',
              className,
            )}
            sentiment={warning.sentiment}
          />
          <WarningBar
            className="rounded-t-none pl-5 md:pl-6"
            icon={RoundedWarningIcon}
            text={warning.value}
            color={sentimentToWarningBarColor(warning.sentiment)}
          />
        </div>
      )}
      {description && !descriptionAsTooltip && (
        <Markdown className="mt-2 font-normal leading-snug text-black/80 dark:text-white/80 md:text-lg">
          {description}
        </Markdown>
      )}
    </div>
  )
  return descriptionAsTooltip ? (
    <Tooltip>
      <TooltipTrigger>{content}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  ) : (
    content
  )
}
