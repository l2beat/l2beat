import type { ReactNode } from 'react'
import { buttonVariants } from '~/components/core/Button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipVisualOnly,
} from '~/components/core/tooltip/Tooltip'
import type { RosetteValue } from '~/components/rosette/types'
import { TableLink } from '~/components/table/TableLink'
import { cn } from '~/utils/cn'
import { getPrivacyAdversariesSectionHref } from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteAnalysis } from './PrivacyRosetteAnalysis'
import { useFollowLinkAfterClose } from './useFollowLinkAfterClose'

const PLACEMENTS = {
  /** A summary table row, linking to the project page. */
  table: {
    Link: TableLink,
    linkClassName: undefined,
    drawerTriggerClassName: 'flex size-full items-center justify-center',
    // The trigger is the rosette alone.
    label: 'Privacy risk analysis',
    // The reasons appear nowhere else on the summary page.
    contentInHtml: true,
    hint: 'Click on the rosette to visit the detailed pages for more info.',
    drawerLinkLabel: 'Open project page',
    isSectionOnPage: false,
  },
  /** The project page summary, linking down to its own section. */
  project: {
    Link: 'a',
    linkClassName: 'flex w-fit',
    drawerTriggerClassName: undefined,
    label: undefined,
    contentInHtml: false,
    hint: undefined,
    drawerLinkLabel: 'See full assessment',
    isSectionOnPage: true,
  },
} as const

interface Props {
  values: RosetteValue[]
  isUnderReview: boolean
  /** The project page. */
  href: string
  placement: keyof typeof PLACEMENTS
  children: ReactNode
}

/** The privacy risk analysis in a tooltip from md up and in a drawer below. */
export function PrivacyRosetteTrigger({
  values,
  isUnderReview,
  href,
  placement,
  children,
}: Props) {
  const settings = PLACEMENTS[placement]
  const Link = settings.Link
  const sectionHref = getPrivacyAdversariesSectionHref(href)
  const { open, setOpen, onLinkClick, onCloseAutoFocus } =
    useFollowLinkAfterClose(sectionHref)
  const analysis = (
    <PrivacyRosetteAnalysis values={values} isUnderReview={isUnderReview} />
  )

  return (
    <>
      <Tooltip contentInHtml={settings.contentInHtml}>
        <TooltipTrigger asChild disabledOnMobile>
          <Link
            href={sectionHref}
            aria-label={settings.label}
            className={cn(settings.linkClassName, 'max-md:hidden')}
          >
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent fitContent>
          {analysis}
          {settings.hint && (
            <TooltipVisualOnly>
              <p className="mt-3 text-secondary text-xs">{settings.hint}</p>
            </TooltipVisualOnly>
          )}
        </TooltipContent>
      </Tooltip>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          className={cn(settings.drawerTriggerClassName, 'md:hidden')}
          aria-label={settings.label}
        >
          {children}
        </DrawerTrigger>
        <DrawerContent
          className="max-h-[90dvh]"
          contentClassName="flex min-h-0 flex-col gap-4 overflow-y-auto pb-6"
          onCloseAutoFocus={onCloseAutoFocus}
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>Privacy risk analysis</DrawerTitle>
            <DrawerDescription>
              How private the protocol stays against each adversary.
            </DrawerDescription>
          </DrawerHeader>
          {analysis}
          <a
            href={sectionHref}
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            onClick={settings.isSectionOnPage ? onLinkClick : undefined}
          >
            {settings.drawerLinkLabel}
          </a>
        </DrawerContent>
      </Drawer>
    </>
  )
}
