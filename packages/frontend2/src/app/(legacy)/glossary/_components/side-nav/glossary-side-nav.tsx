'use client'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { glossarySectionTreshold } from '~/app/_components/nav/consts'
import { type CollectionEntry } from '~/content/getCollection'
import { useCurrentSection } from '~/hooks/use-current-section'
import { scrollVerticallyToItem } from '~/utils/scroll-to-item'
import { GlossarySideNavItem } from './glossary-side-nav-item'

interface Props {
  entries: CollectionEntry<'glossary'>[]
}

export function GlossarySideNav(props: Props) {
  const selectedItem = useRef<HTMLLIElement>(null)
  const overflowContainer = useRef<HTMLUListElement>(null)
  const currentSection = useCurrentSection(glossarySectionTreshold)

  const scrollToItem = useMemo(
    () =>
      debounce(
        (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
          scrollVerticallyToItem({ item, overflowingContainer }),
        200,
      ),
    [],
  )

  useEffect(() => {
    if (!selectedItem.current || !overflowContainer.current) return
    scrollToItem(selectedItem.current, overflowContainer.current)
  }, [currentSection, scrollToItem])

  return (
    <nav
      data-role="glossary-side-nav"
      className="sticky top-[145px] hidden max-h-[calc(70vh-122px)] w-[246px] min-w-[246px] lg:block"
    >
      <div className="custom-scrollbar relative h-full">
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
                ref={selected ? selectedItem : null}
              />
            )
          })}
        </ul>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white via-white dark:from-neutral-900 dark:via-neutral-900" />
      </div>
    </nav>
  )
}
