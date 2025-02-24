'use client'
import { useCallback, useRef } from 'react'
import { faqSectionThreshold } from '~/components/nav/consts'
import { useCurrentSection } from '~/hooks/use-current-section'
import { scrollVerticallyToItem } from '~/utils/scroll-to-item'
import type { FaqItemWithId } from '../page'
import { FaqSideNavItem } from './faq-side-nav-item'

interface Props {
  entries: FaqItemWithId[]
}

export function FaqSideNav(props: Props) {
  const overflowContainer = useRef<HTMLUListElement>(null)
  const currentSection = useCurrentSection(faqSectionThreshold)

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollVerticallyToItem({ item, overflowingContainer }),
    [],
  )

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
              ref={(node) => {
                if (node && selected && overflowContainer.current) {
                  scrollToItem(node, overflowContainer.current)
                }
              }}
            />
          )
        })}
      </ul>
    </div>
  )
}
