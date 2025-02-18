'use client'
import { useCallback, useEffect, useRef } from 'react'
import { faqSectionThreshold } from '~/components/nav/consts'
import { useCurrentSection } from '~/hooks/use-current-section'
import { scrollVerticallyToItem } from '~/utils/scroll-to-item'
import type { FaqItemWithId } from '../page'
import { FaqSideNavItem } from './faq-side-nav-item'

interface Props {
  entries: FaqItemWithId[]
}

export function FaqSideNav(props: Props) {
  const selectedItem = useRef<HTMLLIElement>(null)
  const overflowContainer = useRef<HTMLUListElement>(null)
  const currentSection = useCurrentSection(faqSectionThreshold)

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollVerticallyToItem({ item, overflowingContainer }),
    [],
  )

  useEffect(() => {
    if (!selectedItem.current || !overflowContainer.current) return
    scrollToItem(selectedItem.current, overflowContainer.current)
  }, [currentSection, scrollToItem])

  return (
    <div className="custom-scrollbar sticky top-6 hidden h-[calc(100vh-230px)] lg:block">
      <ul
        className="relative flex h-full w-72 shrink-0 flex-col gap-4 overflow-y-auto pr-4"
        ref={overflowContainer}
      >
        {props.entries.map((entry) => {
          const selected = currentSection?.id === entry.id

          return (
            <FaqSideNavItem
              key={entry.id}
              entry={entry}
              selected={selected}
              ref={selected ? selectedItem : undefined}
            />
          )
        })}
      </ul>
    </div>
  )
}
