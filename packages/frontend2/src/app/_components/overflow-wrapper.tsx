'use client'

import clamp from 'lodash/clamp'
import React, { forwardRef, useEffect, useRef, useState } from 'react'

import ChevronIcon from '~/icons/chevron.svg'
import { cn } from '~/utils/cn'
import { mergeRefs } from '~/utils/merge-refs'

interface OverflowWrapperProps {
  children: React.ReactNode
  childrenClassName?: string
  className?: string
  innerRef?: React.Ref<HTMLDivElement>
}

type VisibleArrows = 'left' | 'right' | 'both'
const ARROWS_THRESHOLD = 4

export const OverflowWrapper = forwardRef<HTMLDivElement, OverflowWrapperProps>(
  ({ children, childrenClassName, className, ...rest }, ref) => {
    const [visibleArrows, setVisibleArrows] = useState<VisibleArrows>()

    const contentRef = useRef<HTMLDivElement>(null)

    function onArrowClick(dir: 'left' | 'right') {
      if (!contentRef.current) return
      const content = contentRef.current

      const contentWidth = content.getBoundingClientRect().width
      let scrollBy
      if (dir === 'left') {
        scrollBy = -clamp(contentWidth, 0, content.scrollLeft)
      } else {
        scrollBy = clamp(
          contentWidth,
          0,
          content.scrollWidth - contentWidth - content.scrollLeft,
        )
      }

      content.scrollBy({
        left: scrollBy,
        behavior: 'smooth',
      })
    }

    useEffect(() => {
      function onScroll() {
        if (!contentRef.current) return
        const content = contentRef.current

        const isScrolledToStart = content.scrollLeft < ARROWS_THRESHOLD
        const isScrolledToEnd =
          content.scrollLeft >
          content.scrollWidth - content.clientWidth - ARROWS_THRESHOLD

        const visibleArrows =
          isScrolledToStart && isScrolledToEnd
            ? undefined
            : isScrolledToStart
              ? 'right'
              : isScrolledToEnd
                ? 'left'
                : 'both'
        setVisibleArrows(visibleArrows)
      }

      onScroll()
      contentRef.current?.addEventListener('scroll', onScroll)
      window.addEventListener('resize', onScroll)
    }, [])

    return (
      <div className={cn('relative', className)} {...rest}>
        <div
          onClick={() => onArrowClick('left')}
          className={cn(
            'pointer-events-none duration-300 absolute inset-y-0 -left-px z-10 w-6 bg-gradient-to-r opacity-0 transition-opacity fade-out-mask',
            (visibleArrows === 'left' || visibleArrows === 'both') &&
              'pointer-events-auto opacity-100',
          )}
        >
          <div className="flex h-full items-center justify-center">
            <ChevronIcon className="scale-75 rotate-90 dark:fill-white" />
          </div>
        </div>
        <div
          ref={mergeRefs(contentRef, ref)}
          className={cn(
            'scrollbar-hide overflow-x-auto',
            visibleArrows === 'left' && 'fade-out-to-left',
            visibleArrows === 'right' && 'fade-out-to-right',
            visibleArrows === 'both' && 'fade-out-horizontal',
            childrenClassName,
          )}
        >
          {children}
        </div>
        <div
          onClick={() => onArrowClick('right')}
          className={cn(
            'pointer-events-none duration-200 absolute inset-y-0 -right-px z-10 w-6 bg-gradient-to-l opacity-0 transition-opacity',
            (visibleArrows === 'right' || visibleArrows === 'both') &&
              'pointer-events-auto opacity-100',
          )}
        >
          <div className="flex h-full items-center justify-center">
            <ChevronIcon className="scale-75 -rotate-90 dark:fill-white" />
          </div>
        </div>
      </div>
    )
  },
)

OverflowWrapper.displayName = 'OverflowWrapper'
