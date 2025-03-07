'use client'
import type { ReactNode } from 'react'
import React, { useEffect, useRef, useState } from 'react'
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
  const [isTruncatedMobile, setIsTruncatedMobile] = useState(false)
  const [isOverflowingDesktop, setIsOverflowingDesktop] = useState(false)

  const mobileContentRef = useRef<HTMLDivElement>(null)
  const desktopContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      if (mobileContentRef.current) {
        const { scrollHeight, offsetHeight } = mobileContentRef.current
        setIsTruncatedMobile(scrollHeight > offsetHeight)
      }

      if (desktopContentRef.current) {
        const { scrollWidth, clientWidth } = desktopContentRef.current
        setIsOverflowingDesktop(scrollWidth > clientWidth)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [children])

  const toggleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  if (expanded) {
    return (
      <div className={cn('w-full', className)}>
        <div className={textClassName}>
          {children}
          <button
            className={cn('ml-1 cursor-pointer underline', textClassName)}
            onClick={toggleExpand}
          >
            Show less
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile  */}
      <div className="md:hidden">
        <div
          ref={mobileContentRef}
          className={cn('relative line-clamp-3', textClassName)}
        >
          {children}
          {isTruncatedMobile && (
            <Drawer>
              <DrawerTrigger className="absolute bottom-0 right-0 inline-flex items-center bg-background">
                <span>...</span>
                <div
                  className={cn('ml-1 cursor-pointer underline', textClassName)}
                >
                  Show more
                </div>
              </DrawerTrigger>
              <DrawerContent className="pb-8">
                <DrawerHeader>
                  <DrawerTitle className="text-lg font-semibold text-primary">
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
      </div>

      {/* Desktop  */}
      <div className="hidden md:block">
        <div
          ref={desktopContentRef}
          className={cn('relative truncate pr-[75px]', textClassName)}
        >
          {children}
          {isOverflowingDesktop && (
            <button
              className={cn(
                'absolute right-0 top-0 cursor-pointer pl-1 underline',
                textClassName,
              )}
              onClick={toggleExpand}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
