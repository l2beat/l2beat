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

export function ShowMoreText({
  children,
  pageTitle,
  textClassName,
  className,
}: {
  children: React.ReactElement | string
  pageTitle: string
  textClassName?: string
  className?: string
}) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      const element = textRef.current
      if (element) {
        setIsOverflowing(element.scrollWidth > element.clientWidth)
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
      <TruncatedText
        pageTitle={pageTitle}
        className="md:hidden"
        textClassName={textClassName}
      >
        {children}
      </TruncatedText>
      <div
        ref={textRef}
        className={cn(
          'relative hidden truncate pr-[75px] md:block',
          textClassName,
        )}
      >
        {children}
        {isOverflowing && (
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
  )
}

interface TruncatedTextProps {
  children: ReactNode
  pageTitle: string
  className?: string
  textClassName?: string
}

function TruncatedText({
  children,
  pageTitle,
  textClassName,
  className,
}: TruncatedTextProps) {
  const [isTruncated, setIsTruncated] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkTruncation = (): void => {
      if (contentRef.current) {
        const { offsetHeight, scrollHeight } = contentRef.current
        setIsTruncated(scrollHeight > offsetHeight)
      }
    }

    checkTruncation()

    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [children])

  return (
    <div className={cn(className)}>
      <div
        ref={contentRef}
        className={cn('relative line-clamp-3', textClassName)}
      >
        {children}
        {isTruncated && (
          <Drawer>
            <DrawerTrigger className="absolute bottom-0 right-0 inline-flex items-center bg-background pl-1">
              <span>...</span>
              <button
                className={cn('ml-1 cursor-pointer underline', textClassName)}
              >
                Show more
              </button>
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
  )
}
