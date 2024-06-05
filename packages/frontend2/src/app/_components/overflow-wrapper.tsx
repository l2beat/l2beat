'use client'

import clamp from 'lodash/clamp'
import React, { useEffect, useRef } from 'react'

import ChevronIcon from '~/icons/chevron.svg'
import { cn } from '~/utils/cn'

interface OverflowWrapperProps {
  children: React.ReactNode
  childrenClassName?: string
  className?: string
  innerRef?: React.Ref<HTMLDivElement>
}

const ARROWS_THRESHOLD = 4

export function OverflowWrapper({
  children,
  childrenClassName,
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'> & OverflowWrapperProps) {
  const leftArrowRef = useRef<HTMLDivElement>(null)
  const rightArrowRef = useRef<HTMLDivElement>(null)
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

  const onScroll = () => {
    if (!contentRef.current) return
    const content = contentRef.current

    const isScrolledToStart = content.scrollLeft < ARROWS_THRESHOLD
    const isScrolledToEnd =
      content.scrollLeft >
      content.scrollWidth - content.clientWidth - ARROWS_THRESHOLD

    leftArrowRef.current?.setAttribute(
      'data-visible',
      isScrolledToStart ? 'false' : 'true',
    )
    rightArrowRef.current?.setAttribute(
      'data-visible',
      isScrolledToEnd ? 'false' : 'true',
    )
    content.setAttribute(
      'data-scrolled-to-start',
      isScrolledToStart ? 'true' : 'false',
    )
    content.setAttribute(
      'data-scrolled-to-end',
      isScrolledToEnd ? 'true' : 'false',
    )
  }

  useEffect(() => {
    onScroll()
    contentRef.current?.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
  }, [])

  return (
    <div className={cn('relative', className)} {...rest}>
      <div
        ref={leftArrowRef}
        onClick={() => onArrowClick('left')}
        className={cn(
          'pointer-events-none duration-300 absolute inset-y-0 -left-px z-10 w-6 bg-gradient-to-r opacity-0 transition-opacity fade-out-mask',
          'data-[visible=true]/overflow-wrapper:pointer-events-auto data-[visible=true]/overflow-wrapper:opacity-100',
        )}
      >
        <div className="flex h-full items-center justify-center">
          <ChevronIcon className="scale-75 rotate-90 dark:fill-white" />
        </div>
      </div>
      <div
        ref={contentRef}
        className={cn(
          'scrollbar-hide overflow-x-auto data-[scrolled-to-start="false"]:fade-out-to-left data-[scrolled-to-end="false"]:fade-out-to-right',
          'data-[scrolled-to-start="false"]:data-[scrolled-to-end="false"]:fade-out-horizontal',
          childrenClassName,
        )}
      >
        {children}
      </div>
      <div
        ref={rightArrowRef}
        onClick={() => onArrowClick('right')}
        className={cn(
          'pointer-events-none duration-200 absolute inset-y-0 -right-px z-10 w-6 bg-gradient-to-l opacity-0 transition-opacity',
          'data-[visible=true]/overflow-wrapper:pointer-events-auto data-[visible=true]/overflow-wrapper:opacity-100',
        )}
      >
        <div className="flex h-full items-center justify-center">
          <ChevronIcon className="scale-75 -rotate-90 dark:fill-white" />
        </div>
      </div>
    </div>
  )
}
