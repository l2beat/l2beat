import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useEventListener } from '~/hooks/useEventListener'
import { useIsMobile } from '~/hooks/useIsMobile'
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
  const isMobile = useIsMobile()

  const handleResize = useCallback(() => {
    if (contentRef.current) {
      const { scrollHeight, offsetHeight, clientWidth, scrollWidth } =
        contentRef.current
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
        <div className="relative">
          <div
            ref={contentRef}
            className={cn(
              'md:truncate md:pr-[75px]',
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
                'absolute top-0 right-0 cursor-pointer pl-1 underline',
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
