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
    <div className="sticky top-28 mt-5 hidden max-h-[calc(100vh-136px)] w-[246px] min-w-[246px] flex-col lg:flex">
      <ul
        className="flex min-h-0 flex-col gap-4 overflow-y-scroll pr-6 pb-2"
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
    </div>
  )
}
