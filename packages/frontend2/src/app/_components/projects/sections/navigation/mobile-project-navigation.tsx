'use client'

import debounce from 'lodash/debounce'
import React, { useEffect, useMemo, useRef } from 'react'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import { useCurrentSection } from '~/hooks/use-current-section'
import { cn } from '~/utils/cn'
import { scrollHorizontallyToItem } from '~/utils/scroll-to-item'
import { type ProjectDetailsSection } from '../types'

interface Props {
  sections: ProjectDetailsSection[]
}

export function MobileProjectNavigation({ sections }: Props) {
  const selectedItem = useRef(null)
  const overflowContainer = useRef<HTMLDivElement>(null)

  const currentSection = useCurrentSection()
  const isSummarySection = currentSection && currentSection.id === 'summary'

  const scrollToItem = useMemo(
    () =>
      debounce(
        (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
          scrollHorizontallyToItem({ item, overflowingContainer }),
        200,
      ),
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
      className="bg-white dark:bg-neutral-900"
    >
      <div className="flex items-center">
        <a
          href="#"
          ref={isSummarySection ? selectedItem : undefined}
          className={cn(
            'whitespace-nowrap p-4 text-xs transition-colors',
            isSummarySection &&
              'border-b-2 border-current text-pink-900 dark:text-pink-200',
          )}
        >
          Summary
        </a>
        {sections.map((section) => {
          if (section.excludeFromNavigation) {
            return null
          }
          const selected = section.props.id === currentSection?.id

          return (
            <a
              key={section.props.id}
              ref={selected ? selectedItem : undefined}
              href={`#${section.props.id}`}
              className={cn(
                'whitespace-nowrap p-4 text-xs transition-colors',
                selected &&
                  'border-b-2 border-current text-pink-900 dark:text-pink-200',
              )}
            >
              {section.props.title}
            </a>
          )
        })}
      </div>
    </OverflowWrapper>
  )
}
