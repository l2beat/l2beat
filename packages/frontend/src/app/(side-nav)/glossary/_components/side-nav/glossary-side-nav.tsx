'use client'
import { useCallback, useRef } from 'react'
import { glossarySectionTreshold } from '~/components/nav/consts'
import type { CollectionEntry } from '~/content/get-collection'
import { useCurrentSection } from '~/hooks/use-current-section'
import { scrollVerticallyToItem } from '~/utils/scroll-to-item'
import { GlossarySideNavItem } from './glossary-side-nav-item'

interface Props {
  entries: CollectionEntry<'glossary'>[]
}

export function GlossarySideNav(props: Props) {
  const overflowContainer = useRef<HTMLUListElement>(null)
  const currentSection = useCurrentSection(glossarySectionTreshold)

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollVerticallyToItem({ item, overflowingContainer }),
    [],
  )

  return (
    <div className="custom-scrollbar sticky top-28 mt-5 hidden h-[calc(100vh-350px)] w-[246px] min-w-[246px] lg:block">
      <ul
        className="flex h-full flex-col gap-4 overflow-y-scroll pb-8 pr-6"
        ref={overflowContainer}
      >
        {props.entries.map((entry) => {
          const selected = currentSection?.id === entry.id

          return (
            <GlossarySideNavItem
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background via-transparent" />
    </div>
  )
}
