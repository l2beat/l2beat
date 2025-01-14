'use client'

import { useCallback, useEffect, useRef } from 'react'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import { useCurrentSection } from '~/hooks/use-current-section'
import { cn } from '~/utils/cn'
import { scrollHorizontallyToItem } from '~/utils/scroll-to-item'
import { type ProjectNavigationSection } from './types'

interface Props {
  sections: ProjectNavigationSection[]
}

export function MobileProjectNavigation({ sections }: Props) {
  const selectedItem = useRef(null)
  const overflowContainer = useRef<HTMLDivElement>(null)

  const currentSection = useCurrentSection()
  const isSummarySection = currentSection && currentSection.id === 'summary'

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollHorizontallyToItem({ item, overflowingContainer }),
    [],
  )

  useEffect(() => {
    if (!selectedItem.current || !overflowContainer.current) return
    scrollToItem(selectedItem.current, overflowContainer.current)
  }, [currentSection, scrollToItem])

  if (sections.length === 0) return null

  return (
    <OverflowWrapper
      ref={overflowContainer}
      className="flex justify-center bg-header-primary"
      childrenClassName="w-full"
    >
      <div className="flex items-center justify-between">
        <a
          href="#"
          ref={isSummarySection ? selectedItem : undefined}
          className={cn(
            'w-full whitespace-nowrap border-b border-divider p-4 text-center text-xs transition-colors',
            isSummarySection && 'border-b-2 border-current text-brand',
          )}
        >
          Summary
        </a>
        {sections.map((section) => {
          const selected =
            section.id === currentSection?.id ||
            section.subsections?.some((s) => s.id === currentSection?.id)

          return (
            <a
              key={section.id}
              ref={selected ? selectedItem : undefined}
              href={`#${section.id}`}
              className={cn(
                'w-full whitespace-nowrap border-b border-divider p-4 text-center text-xs transition-colors',
                selected && 'border-b-2 border-current text-brand',
              )}
            >
              {section.title}
            </a>
          )
        })}
      </div>
    </OverflowWrapper>
  )
}
