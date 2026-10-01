import { type ReactNode, useRef, useState } from 'react'
import { buttonVariants } from '~/components/core/Button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { PrivacyRosetteAnalysis } from './PrivacyRosetteAnalysis'

interface Props {
  adversaries: PrivacyAdversariesSummary
  isUnderReview: boolean
  /** The adversaries section of the project page. */
  sectionHref: string
  linkLabel: string
  /** Needed when the trigger has no text of its own. */
  triggerLabel?: string
  triggerClassName?: string
  children: ReactNode
}

/** The rosette tooltip for mobile, where it does not fit. */
export function PrivacyRosetteDrawer({
  adversaries,
  isUnderReview,
  sectionHref,
  linkLabel,
  triggerLabel,
  triggerClassName,
  children,
}: Props) {
  const [open, setOpen] = useState(false)
  const followLinkOnClose = useRef(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className={triggerClassName} aria-label={triggerLabel}>
        {children}
      </DrawerTrigger>
      <DrawerContent
        className="max-h-[90dvh]"
        contentClassName="flex min-h-0 flex-col gap-4 overflow-y-auto pb-6"
        onCloseAutoFocus={(e) => {
          if (!followLinkOnClose.current) return
          followLinkOnClose.current = false
          e.preventDefault()
          window.location.assign(sectionHref)
        }}
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>Privacy risk analysis</DrawerTitle>
          <DrawerDescription>{adversaries.promise.text}</DrawerDescription>
        </DrawerHeader>
        <PrivacyRosetteAnalysis
          adversaries={adversaries}
          isUnderReview={isUnderReview}
        />
        <a
          href={sectionHref}
          className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
          onClick={(e) => {
            // The open drawer locks scrolling and restores the old position
            // as it closes, which would undo a jump within the page.
            e.preventDefault()
            followLinkOnClose.current = true
            setOpen(false)
          }}
        >
          {linkLabel}
        </a>
      </DrawerContent>
    </Drawer>
  )
}
