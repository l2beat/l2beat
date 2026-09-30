import type { ComponentProps, ReactNode } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { SentimentText } from '~/components/SentimentText'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import {
  getPrivacyAdversariesSentence,
  getPrivacyAdversaryGist,
  PRIVACY_ADVERSARY_VERDICT,
} from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteFigure } from './PrivacyRosetteFigure'

type Props = Pick<ComponentProps<typeof Drawer>, 'open' | 'onOpenChange'> & {
  adversaries: PrivacyAdversariesSummary
  isUnderReview?: boolean
  /** The rosette the drawer opens from. */
  trigger: ReactNode
  triggerLabel: string
  triggerClassName?: string
  /** A link out, set under the analysis. */
  children: ReactNode
}

/**
 * The rosette tooltip's content for mobile, where the tooltip is too wide, as
 * a drawer that slides up on tap. There is no width to set gists beside their
 * verdicts, so each adversary is a row with the verdict on the right and the
 * whole gist underneath; the drawer scrolls if it has to.
 */
export function PrivacyRosetteDrawer({
  adversaries,
  isUnderReview,
  trigger,
  triggerLabel,
  triggerClassName,
  children,
  ...props
}: Props) {
  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)

  return (
    <Drawer {...props}>
      <DrawerTrigger
        className={cn('flex items-center justify-center', triggerClassName)}
        aria-label={triggerLabel}
      >
        {trigger}
      </DrawerTrigger>
      <DrawerContent
        className="max-h-[90dvh]"
        contentClassName="flex min-h-0 flex-col px-0 pb-0"
      >
        <DrawerHeader className="px-4 pb-3 text-left">
          <DrawerTitle className="mb-0 text-heading-20">
            Privacy risk analysis
          </DrawerTitle>
          <DrawerDescription className="font-medium text-paragraph-14">
            {isUnderReview
              ? 'Under review.'
              : `${subject} is private against ${held}/${total} adversaries.`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-6">
          {isUnderReview ? (
            <p className="text-paragraph-14">
              Projects under review might present uncompleted information &
              data. L2BEAT Team is working to research & validate content before
              publishing.
            </p>
          ) : (
            <>
              <div className="mx-auto">
                <PrivacyRosetteFigure adversaries={adversaries} />
              </div>
              <ul className="flex flex-col divide-y divide-divider">
                {adversaries.cells.map((cell) => (
                  <li key={cell.id} className="py-3 first:pt-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-subtitle-12 uppercase">
                        {cell.label}
                      </span>
                      <SentimentText
                        sentiment={cell.sentiment}
                        vibrant
                        className="shrink-0 font-medium text-label-value-15"
                      >
                        {PRIVACY_ADVERSARY_VERDICT[cell.sentiment]}
                      </SentimentText>
                    </div>
                    <p className="mt-1 text-paragraph-14 text-secondary">
                      {getPrivacyAdversaryGist(cell.exposure)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/** The link at the bottom of the drawer; the tap no longer navigates. */
export function PrivacyRosetteDrawerLink({
  children,
  className,
  ...props
}: ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-lg border border-divider py-3 font-medium text-label-value-15 text-link',
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRightIcon className="size-3.5 fill-current" />
    </a>
  )
}
