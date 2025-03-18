'use client'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { useEventCallback } from '~/hooks/use-event-callback'
import { useEventListener } from '~/hooks/use-event-listener'
import { cn } from '~/utils/cn'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './core/drawer'

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

  const handleResize = useEventCallback(() => {
    if (contentRef.current) {
      const { scrollHeight, offsetHeight, clientWidth, scrollWidth } =
        contentRef.current
      if (isMobile) {
        setIsOverflowing(scrollHeight > offsetHeight)
      } else {
        setIsOverflowing(scrollWidth > clientWidth)
      }
    }
  })

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
                'absolute right-0 top-0 cursor-pointer pl-1 underline',
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
                  <DrawerTitle className="mb-2.5 text-lg font-semibold text-primary">
                    {pageTitle}
                  </DrawerTitle>
                  <DrawerDescription className="text-xs font-normal text-primary">
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
