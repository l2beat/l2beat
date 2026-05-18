import { useCallback } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/components/core/Drawer'
import { useDevice } from '~/hooks/useDevice'
import { cn } from '~/utils/cn'
import { RecentChangesPanel } from './RecentChangesPanel'

interface Props {
  projectId: string
  projectName: string
  onOpenChange: (open: boolean) => void
}

function scrollToUpdatesMonitorSection() {
  const el = document.getElementById('updates-monitor')
  if (!el) return
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}#updates-monitor`,
  )
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function RecentChangesDialog({
  projectId,
  projectName,
  onOpenChange,
}: Props) {
  const { isMobile } = useDevice()
  const description = `Recent updates for ${projectName} (past 7 days)`

  const goToFullHistory = useCallback(() => {
    onOpenChange(false)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => scrollToUpdatesMonitorSection()),
    )
  }, [onOpenChange])

  const titleRow = (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="font-bold text-xl leading-none">Recent updates</span>
      <span className="text-secondary text-sm leading-none">Past 7 days</span>
    </div>
  )

  const footerLinkClassName =
    'text-2xs font-medium text-link underline underline-offset-2 transition-colors hover:text-blue-550 dark:hover:text-blue-550'

  const renderFooter = (paddingClass: string) => (
    <div
      className={cn(
        'flex shrink-0 justify-center border-divider border-t py-3',
        paddingClass,
      )}
    >
      <button
        type="button"
        className={footerLinkClassName}
        onClick={goToFullHistory}
      >
        See all historical changes
      </button>
    </div>
  )

  const body = <RecentChangesPanel projectId={projectId} maxAgeDays={7} />

  if (isMobile) {
    return (
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent
          className="max-h-[90dvh]"
          contentClassName="flex min-h-0 flex-1 flex-col px-0 pb-0"
        >
          <DrawerHeader className="shrink-0 px-4 pb-2">
            <DrawerTitle className="mb-0">{titleRow}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
              {body}
            </div>
            {renderFooter('px-4 pb-4')}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="primary-card flex max-h-[90dvh] w-[640px] flex-col overflow-hidden bg-surface-primary p-0 lg:w-[768px]">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="shrink-0 border-divider border-b px-6 py-4">
          <DialogTitle className="mb-0">{titleRow}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{body}</div>
          {renderFooter('px-6 pb-5')}
        </div>
      </DialogContent>
    </Dialog>
  )
}
