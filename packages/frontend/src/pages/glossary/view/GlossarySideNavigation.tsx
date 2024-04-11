import React from 'react'

import { ChiliIcon } from '../../../components/icons/symbols/ChiliIcon'
import { cn } from '../../../utils/cn'
import { GlossaryEntry } from '../props/getGlossaryEntry'

export function GlossarySideNavigation(props: { entries: GlossaryEntry[] }) {
  return (
    <nav
      data-role="glossary-side-nav"
      className="sticky top-[145px] hidden max-h-[70vh] w-[246px] min-w-[246px] lg:block"
    >
      <div className="custom-scrollbar relative h-full">
        <ul className="flex h-full flex-col gap-4 overflow-y-scroll pb-8 pr-6">
          {props.entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                data-role="glossary-side-nav-item"
                className={cn(
                  'flex items-center gap-1 text-xs font-medium transition-colors duration-100',
                  'text-zinc-500 hover:text-zinc-700 dark:text-pure-white/80 dark:hover:text-pure-white',
                  'data-[selected="true"]:text-pink-900 data-[selected="true"]:hover:text-fuchsia-700 dark:data-[selected="true"]:text-pink-200 dark:data-[selected="true"]:hover:text-[#C164E3]',
                )}
              >
                <span className="line-clamp-1">{entry.term}</span>
                {entry.isSpicy && <ChiliIcon className="shrink-0" />}
              </a>
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white via-white dark:from-neutral-900 dark:via-neutral-900" />
      </div>
    </nav>
  )
}
