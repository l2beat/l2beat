import type { Sentiment } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CodeIcon } from '~/icons/Code'
import { CodeCheckIcon } from '~/icons/CodeCheck'
import { CodeOffIcon } from '~/icons/CodeOff'
import { GlobeIcon } from '~/icons/Globe'
import { PinIcon } from '~/icons/Pin'
import { RefreshIcon } from '~/icons/Refresh'
import { getReferenceAppDelivery } from '~/pages/privacy/referenceAppUi'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import { cn } from '~/utils/cn'
import { sentimentToTextColor } from '~/utils/sentiment'

/** How the code reaches the user: pinned, updated by a store, or served per visit. */
export const DELIVERY_KIND_ICONS = {
  pinned: PinIcon,
  latestOnly: RefreshIcon,
  hosted: GlobeIcon,
} as const

/** How the app relates to public source. */
export const DELIVERY_SOURCE_ICONS = {
  reproducible: CodeCheckIcon,
  open: CodeIcon,
  closed: CodeOffIcon,
} as const

/** The colour of a delivery symbol, on the page's sentiment scale. */
export function deliveryIconColor(sentiment: Sentiment) {
  return sentimentToTextColor(sentiment, { vibrant: true })
}

/**
 * The delivery as two symbols, for places too narrow for its words, each in
 * the colour of its sentiment. The tooltip holds the words.
 */
export function PrivacyDeliveryIcons({
  app,
  className,
}: {
  app: PrivacyReferenceApp
  className?: string
}) {
  const delivery = getReferenceAppDelivery(app)
  const KindIcon = DELIVERY_KIND_ICONS[delivery.kind.id]
  const SourceIcon = DELIVERY_SOURCE_ICONS[delivery.source.id]

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={delivery.label}
        className={cn('items-center gap-1', className)}
      >
        <KindIcon
          className={cn('size-4', deliveryIconColor(delivery.kind.sentiment))}
        />
        <SourceIcon
          className={cn('size-4', deliveryIconColor(delivery.source.sentiment))}
        />
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <div className="space-y-2">
          <div className="font-medium text-sm">{delivery.label}</div>
          <p className="text-xs leading-normal">{delivery.kind.description}</p>
          <p className="text-xs leading-normal">
            {delivery.source.description}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
