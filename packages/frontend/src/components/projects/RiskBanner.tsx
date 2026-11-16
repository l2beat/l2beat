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
import { SentimentText } from '../SentimentText'
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
  regular,
  warning,
  description,
  className,
  size = 'regular',
  descriptionAsTooltip,
  info = 'full',
}: RiskBannerProps) {
  const adjSentiment = sentiment ?? 'neutral'
  // With both paths, the emergency explanation follows its value directly:
  // no fixed height, 8px between value and text, like the regular half.
  const describesEmergency = !!regular && !!description && info === 'full'
  const content = (
    <div>
      <div
        className={cn(
          'flex flex-row items-stretch rounded-lg',
          !describesEmergency && size === 'regular' && 'h-16',
          !describesEmergency && size === 'large' && 'h-20.5',
          sentimentToTransparentBgColor(adjSentiment),
          (regular || warning) && info === 'full' && 'rounded-b-none',
          className,
        )}
      >
        <GrissiniStick
          sentiment={adjSentiment}
          className={cn(
            // Without a fixed height, h-full resolves to nothing: stretch.
            // GrissiniStick sets its own height; auto lets it stretch.
            describesEmergency ? 'h-auto self-stretch' : 'h-full',
            'shrink-0 max-md:w-1',
            (regular || warning) && info === 'full' && 'rounded-b-none',
            className,
          )}
        />
        <div
          className={cn(
            'flex flex-1 flex-col items-start justify-center gap-1 p-4',
            // Label at the same height as the fixed-height siblings.
            describesEmergency && 'pt-6 pb-2',
          )}
        >
          <div
            className={cn(
              'text-left uppercase',
              size === 'regular' && 'text-subtitle-10',
              size === 'large' && 'font-semibold text-3xs md:text-2xs',
            )}
          >
            {name}
          </div>
          <div
            className={cn(
              'text-left',
              size === 'regular' && 'font-bold text-label-value-14',
              size === 'large' &&
                'font-bold text-base leading-none! md:text-lg',
              sentimentToTextColor(adjSentiment, { vibrant: true }),
            )}
          >
            {regular ? `${value} (emergency upgrade path)` : value}
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
      {describesEmergency && (
        // The description explains the emergency path, so it sits in that
        // block, above the regular path rather than under it.
        <div className="relative">
          <GrissiniStick
            className={cn(
              'absolute inset-y-0 left-0 h-full shrink-0 rounded-none max-md:w-1',
              className,
            )}
            sentiment={adjSentiment}
          />
          <div
            className={cn(
              'px-4 pb-4 pl-5 md:pl-6',
              sentimentToTransparentBgColor(adjSentiment),
            )}
          >
            <Markdown className="font-normal text-paragraph-15 md:text-paragraph-16">
              {description}
            </Markdown>
          </div>
        </div>
      )}
      {regular && info === 'full' && (
        <div className="relative">
          <GrissiniStick
            className={cn(
              'absolute inset-y-0 left-0 h-full shrink-0 rounded-t-none max-md:w-1',
              className,
            )}
            sentiment={regular.sentiment ?? 'neutral'}
          />
          <div
            className={cn(
              'rounded-lg rounded-t-none p-4 pl-5 md:pl-6',
              sentimentToTransparentBgColor(regular.sentiment ?? 'neutral'),
            )}
          >
            <div
              className={cn(
                'mb-2 font-bold text-base leading-none! md:text-lg',
                sentimentToTextColor(regular.sentiment ?? 'neutral', {
                  vibrant: true,
                }),
              )}
            >
              {regular.value} (regular upgrade path)
            </div>
            <Markdown className="font-normal text-paragraph-15 md:text-paragraph-16">
              {regular.description}
            </Markdown>
          </div>
        </div>
      )}
      {warning && !regular && info === 'full' && (
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
      {description && !regular && info === 'full' && (
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
        {regular && (
          <div className="mb-2">
            <SentimentText
              sentiment={regular.sentiment ?? 'neutral'}
              vibrant={true}
              className="mb-1 block font-medium"
            >
              {`${regular.value} (regular upgrade path)`}
            </SentimentText>
            {regular.description}
          </div>
        )}
        {warning && !regular && (
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
