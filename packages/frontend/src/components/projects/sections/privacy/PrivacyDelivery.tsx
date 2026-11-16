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

/** How the code arrives, or how the app relates to public source. */
export type DeliveryPart = Delivery['kind'] | Delivery['source']
type Delivery = ReturnType<typeof getReferenceAppDelivery>

/**
 * The delivery in the summary: each part's symbol and word, on a line of its
 * own under the app's name, so a long name never pushes the stat into a new
 * row. The tooltip says what each part means.
 */
export function PrivacyDeliverySummary({ app }: { app: PrivacyReferenceApp }) {
  const delivery = getReferenceAppDelivery(app)
  const parts = [delivery.kind, delivery.source]

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={delivery.label}
        className="flex items-center gap-2.5 font-medium text-paragraph-12 text-secondary"
      >
        {parts.map((part) => (
          <span key={part.id} className="flex items-center gap-1">
            <DeliveryIcon part={part} className="size-3.5" />
            {part.label}
          </span>
        ))}
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <div className="flex flex-col gap-3">
          {parts.map((part) => (
            <div key={part.id}>
              <div className="flex items-center gap-1.5 font-bold text-label-value-14">
                <DeliveryIcon part={part} className="size-4" />
                {part.label}
              </div>
              <p className="mt-1 font-normal text-paragraph-13">
                {part.description}
              </p>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

/** A part's symbol, coloured by its sentiment. */
export function DeliveryIcon({
  part,
  className,
}: {
  part: DeliveryPart
  className?: string
}) {
  const Icon = ICONS[part.id]
  return (
    <Icon
      className={cn(
        'shrink-0',
        sentimentToTextColor(part.sentiment, { vibrant: true }),
        className,
      )}
    />
  )
}

const ICONS = {
  pinned: PinIcon,
  latestOnly: RefreshIcon,
  hosted: GlobeIcon,
  reproducible: CodeCheckIcon,
  open: CodeIcon,
  closed: CodeOffIcon,
} as const
