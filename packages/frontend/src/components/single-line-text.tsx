'use client'
import { useEffect, useRef, useState } from 'react'
import { cn } from '~/utils/cn'

export function SingleLineText({
  children,
  textClassName,
  className,
}: {
  children: React.ReactElement | string
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
      <div
        ref={textRef}
        className={cn('relative truncate pr-[75px]', textClassName)}
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
