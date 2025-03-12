'use client'
import type { ReactNode } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '~/hooks/use-breakpoint'
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

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        if (isMobile) {
          const { scrollHeight, offsetHeight } = contentRef.current
          setIsOverflowing(scrollHeight > offsetHeight)
        } else {
          const { scrollWidth, clientWidth } = contentRef.current
          setIsOverflowing(scrollWidth > clientWidth)
        }
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [children, isMobile])

  const toggleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <div className={cn('w-full', className)}>
      {expanded ? (
        <div className={textClassName}>
          {children}
          <button
            className={cn('ml-1 cursor-pointer underline', textClassName)}
            onClick={toggleExpand}
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
              onClick={toggleExpand}
            >
              Show more
            </button>
          )}

          {/* Mobile Show More */}
          {isOverflowing && (
            <Drawer>
              <DrawerTrigger
                className={cn(
                  'cursor-pointer underline',
                  'md:hidden',
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
                  <DrawerDescription className={textClassName}>
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
