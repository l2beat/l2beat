import clamp from 'lodash/clamp'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useEventCallback } from '~/hooks/useEventCallback'
import { useEventListener } from '~/hooks/useEventListener'
import { useResizeObserver } from '~/hooks/useResizeObserver'

import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { mergeRefs } from '~/utils/mergeRefs'

interface OverflowWrapperProps {
  children: React.ReactNode
  childrenClassName?: string
  childrenRef?: React.RefObject<HTMLDivElement | null>
  className?: string
  ref?: React.RefObject<HTMLDivElement | null>
}

type VisibleArrows = 'left' | 'right' | 'both'
const ARROWS_THRESHOLD = 4

export const OverflowWrapper = ({
  ref,
  children,
  childrenClassName,
  childrenRef,
  className,
  ...rest
}: OverflowWrapperProps) => {
  const [visibleArrows, setVisibleArrows] = useState<VisibleArrows>()

  const contentRef = useRef<HTMLDivElement>(null)

  const onArrowClick = useEventCallback((dir: 'left' | 'right') => {
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
  })

  const updateArrows = useEventCallback(() => {
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
  })

  useEffect(updateArrows, [])

  useEventListener('scroll', updateArrows, contentRef)
  useEventListener('resize', updateArrows)

  useResizeObserver({ ref: childrenRef, onResize: updateArrows })

  return (
    <div className={cn('relative', className)} {...rest}>
      <div
        title="Scroll left"
        onClick={() => onArrowClick('left')}
        className={cn(
          '-left-px pointer-events-none absolute inset-y-0 z-10 w-6 bg-linear-to-r opacity-0 transition-opacity duration-300',
          (visibleArrows === 'left' || visibleArrows === 'both') &&
            'pointer-events-auto opacity-100',
        )}
      >
        <div className="flex h-full items-center justify-center">
          <ChevronIcon className="rotate-90 scale-75 dark:fill-white" />
        </div>
      </div>
      <div
        data-role="overflow-wrapper-content"
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
        title="Scroll right"
        onClick={() => onArrowClick('right')}
        className={cn(
          '-right-px pointer-events-none absolute inset-y-0 z-10 w-6 bg-linear-to-l opacity-0 transition-opacity duration-200',
          (visibleArrows === 'right' || visibleArrows === 'both') &&
            'pointer-events-auto opacity-100',
        )}
      >
        <div className="flex h-full items-center justify-center">
          <ChevronIcon className="-rotate-90 scale-75 dark:fill-white" />
        </div>
      </div>
    </div>
  )
}

OverflowWrapper.displayName = 'OverflowWrapper'
