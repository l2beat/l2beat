import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDevice } from '~/hooks/useDevice'
import { useEventListener } from '~/hooks/useEventListener'
import { cn } from '~/utils/cn'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './core/Drawer'

interface ShowMoreTextProps {
  children: ReactNode
  pageTitle: string
  textClassName?: string
  className?: string
}

export function ShowMoreText({
  children,
  pageTitle,
  textClassName,
  className,
}: ShowMoreTextProps) {
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useDevice()

  const handleResize = useCallback(() => {
    if (contentRef.current) {
      const { scrollHeight, offsetHeight, clientWidth, scrollWidth } =
        contentRef.current
      // Matches the classes below: two lines under `md`, one line from it.
      if (isMobile) {
        setIsOverflowing(scrollHeight > offsetHeight)
      } else {
        setIsOverflowing(scrollWidth > clientWidth)
      }
    }
  }, [isMobile])

  useEffect(() => {
    handleResize()
  }, [handleResize])
  useEventListener('resize', handleResize)

  return (
    <div className={cn('w-full', className)}>
      {expanded ? (
        <div className={textClassName}>
          {children}
          <button
            className={cn('ml-1 cursor-pointer underline', textClassName)}
            onClick={() => setExpanded((s) => !s)}
          >
            Show less
          </button>
        </div>
      ) : (
        // From `md` the text and the button share a row with a fixed gap, so
        // the ellipsis never runs into the button. The measured box is
        // exactly the one the text is cut in.
        <div className="md:flex md:items-baseline md:gap-2">
          <div
            ref={contentRef}
            className={cn(
              'md:min-w-0 md:flex-1 md:truncate',
              'line-clamp-2 md:line-clamp-none',
              textClassName,
            )}
          >
            {children}
          </div>

          {/* Desktop Show More */}
          {isOverflowing && (
            <button
              className={cn(
                'shrink-0 cursor-pointer underline',
                'hidden md:block',
                textClassName,
              )}
              onClick={() => setExpanded((s) => !s)}
            >
              Show more
            </button>
          )}

          {/* Mobile Show More */}
          {isOverflowing && (
            <Drawer>
              <DrawerTrigger
                className={cn(
                  'cursor-pointer underline md:hidden',
                  textClassName,
                )}
              >
                Show more
              </DrawerTrigger>
              <DrawerContent className="pb-8">
                <DrawerHeader>
                  <DrawerTitle className="mb-2.5 font-semibold text-lg text-primary">
                    {pageTitle}
                  </DrawerTitle>
                  <DrawerDescription className="font-normal text-primary text-xs">
                    {children}
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      )}
    </div>
  )
}
