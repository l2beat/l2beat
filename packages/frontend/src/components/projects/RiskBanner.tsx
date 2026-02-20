import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import {
  sentimentToTextColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/Tooltip'
import { Markdown } from '../markdown/Markdown'
import { GrissiniStick } from '../rosette/grissini/GrissiniStick'
import type { RosetteValue } from '../rosette/types'
import { sentimentToWarningBarColor, WarningBar } from '../WarningBar'

interface RiskBannerProps extends RosetteValue {
  className?: string
  size?: 'large' | 'regular'
  descriptionAsTooltip?: boolean
  info?: 'compact' | 'full'
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
  info = 'full',
}: RiskBannerProps) {
  const adjSentiment = sentiment ?? 'neutral'
  const content = (
    <div>
      <div
        className={cn(
          'flex flex-row items-stretch rounded-lg',
          size === 'regular' && 'h-16',
          size === 'large' && 'h-20.5',
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
          <div
            className={cn(
              'text-left uppercase',
              size === 'regular' && 'text-subtitle-10',
              size === 'large' &&
                'font-semibold text-3xs uppercase md:text-2xs',
            )}
          >
            {name}
          </div>
          <div
            className={cn(
              'text-left',
              size === 'regular' && 'font-bold text-label-value-14',
              size === 'large' && 'font-bold text-sm leading-none! md:text-lg',
              sentimentToTextColor(adjSentiment, { vibrant: true }),
            )}
          >
            {value}
            {warning && info === 'compact' && (
              <RoundedWarningIcon
                className={cn(
                  'ml-1 inline-block fill-current',
                  sentimentToTextColor(warning.sentiment),
                )}
              />
            )}
          </div>
        </div>
      </div>
      {warning && info === 'full' && (
        <div className="relative">
          <GrissiniStick
            className={cn(
              'absolute inset-y-0 left-0 h-full shrink-0 rounded-t-none max-md:w-1',
              className,
            )}
            sentiment={warning.sentiment}
          />
          <WarningBar
            className={cn(
              'rounded-t-none pl-5 md:pl-6',
              sentimentToTransparentBgColor(warning.sentiment),
            )}
            icon={RoundedWarningIcon}
            text={warning.value}
            color={sentimentToWarningBarColor(warning.sentiment)}
          />
        </div>
      )}
      {description && info === 'full' && (
        <Markdown className="mt-2 font-normal text-paragraph-15 md:text-paragraph-16">
          {description}
        </Markdown>
      )}
    </div>
  )
  return descriptionAsTooltip ? (
    <Tooltip>
      <TooltipTrigger>{content}</TooltipTrigger>
      <TooltipContent>
        {warning && (
          <WarningBar
            className="mb-2"
            icon={RoundedWarningIcon}
            text={warning.value}
            color={sentimentToWarningBarColor(warning.sentiment)}
          />
        )}
        {description}
      </TooltipContent>
    </Tooltip>
  ) : (
    content
  )
}
