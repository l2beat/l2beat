'use client'

import React from 'react'
import { type CollectionEntry } from '~/content/getCollection'
import { GlossarySideNavItem } from './glossary-side-nav-item'
import { useCurrentSection } from '~/hooks/use-current-section'

interface Props {
  entries: CollectionEntry<'glossary'>[]
}

export function GlossarySideNav(props: Props) {
  const currentSection = useCurrentSection({
    desktop: '164px',
    mobile: '132px',
  })

  return (
    <nav
      data-role="glossary-side-nav"
      className="sticky top-[145px] hidden max-h-[calc(70vh-122px)] w-[246px] min-w-[246px] lg:block"
    >
      <div className="custom-scrollbar relative h-full">
        <ul className="flex h-full flex-col gap-4 overflow-y-scroll pb-8 pr-6">
          {props.entries.map((entry) => (
            <GlossarySideNavItem
              key={entry.id}
              entry={entry}
              selected={currentSection?.id === entry.id}
            />
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white via-white dark:from-neutral-900 dark:via-neutral-900" />
      </div>
    </nav>
  )
}
