import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { ImageIcon } from '~/icons/Image'
import { cn } from '~/utils/cn'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Dialog'

interface ChartScreenshotContextValue {
  title: string
}

const ChartScreenshotContext =
  createContext<ChartScreenshotContextValue | null>(null)

/**
 * Charts below get a button that opens them in a dialog made for screenshots,
 * titled `title`.
 */
export function ChartScreenshotProvider({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const value = useMemo(() => ({ title }), [title])
  return (
    <ChartScreenshotContext.Provider value={value}>
      {children}
    </ChartScreenshotContext.Provider>
  )
}

export function useChartScreenshot() {
  return useContext(ChartScreenshotContext)
}

const label = 'Open chart for a screenshot'

export function ChartScreenshotDialog({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  /** The chart to show, rendered only while the dialog is open. */
  children: ReactNode
}) {
  return (
    <Dialog>
      {/* A native title, as a Radix tooltip trigger wrapping the dialog
          trigger re-renders forever when the chart re-renders */}
      <DialogTrigger
        aria-label={label}
        title={label}
        className={cn(
          'flex size-6 items-center justify-center rounded-md text-secondary transition-colors',
          'hover:bg-surface-secondary primary-card:hover:bg-surface-secondary hover:text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          className,
        )}
      >
        <ImageIcon className="size-4" />
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="primary-card w-[1120px] max-w-[calc(100vw-1rem)] gap-0 bg-surface-primary p-4 md:p-8"
      >
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="text-left">
          <DialogTitle className="text-heading-20 md:text-heading-24">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 md:mt-8">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
