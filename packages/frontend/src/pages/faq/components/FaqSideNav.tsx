import { useCallback, useRef } from 'react'
import { useCurrentSection } from '~/hooks/useCurrentSection'
import type { FaqItemWithId } from '~/pages/faq/FaqPage'
import { scrollVerticallyToItem } from '~/utils/scrollToItem'
import { FaqSideNavItem } from './FaqSideNavItem'

interface Props {
  entries: FaqItemWithId[]
}

export function FaqSideNav(props: Props) {
  const overflowContainer = useRef<HTMLUListElement>(null)
  const currentSection = useCurrentSection({
    desktop: '200px',
  })

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollVerticallyToItem({
        item,
        overflowingContainer,
      }),
    [],
  )

  return (
    <div className="sticky top-6 mt-5 hidden h-[calc(100vh-230px)] lg:block">
      <ul
        className="relative flex h-full w-72 shrink-0 flex-col gap-4 overflow-y-auto pr-4 pb-2"
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mr-2 h-8 bg-linear-to-t from-background via-transparent" />
    </div>
  )
}
