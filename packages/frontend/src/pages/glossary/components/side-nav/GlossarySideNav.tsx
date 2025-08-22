import { useCallback, useRef } from 'react'
import type { CollectionEntry } from '~/content/getCollection'
import { useCurrentSection } from '~/hooks/useCurrentSection'
import { scrollVerticallyToItem } from '~/utils/scrollToItem'
import { glossarySectionThreshold } from '../consts'
import { GlossarySideNavItem } from './GlossarySideNavItem'

interface Props {
  entries: CollectionEntry<'glossary'>[]
}

export function GlossarySideNav(props: Props) {
  const overflowContainer = useRef<HTMLUListElement>(null)
  const currentSection = useCurrentSection(glossarySectionThreshold)

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollVerticallyToItem({ item, overflowingContainer }),
    [],
  )

  return (
    <div className="sticky top-28 mt-5 hidden h-[calc(100vh-350px)] w-[246px] min-w-[246px] lg:block">
      <ul
        className="flex h-full flex-col gap-4 overflow-y-scroll pr-6 pb-2"
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mr-2 h-8 bg-linear-to-t from-background via-transparent" />
    </div>
  )
}
