import React from 'react'

import { CopyButton } from '../../../components/CopyButton'
import { ChiliIcon } from '../../../components/icons/symbols/ChiliIcon'
import { GlossaryEntry } from '../props/getGlossaryEntry'

export function GlossaryItem(props: { entry: GlossaryEntry }) {
  return (
    <section className="mt-12 first:mt-0" id={props.entry.id}>
      <div className="group flex items-center gap-2 pb-4">
        <a
          href={`#${props.entry.id}`}
          className="peer flex items-center gap-2 text-2xl font-bold text-gray-850 no-underline dark:text-white"
        >
          {props.entry.term}
          {props.entry.isSpicy && <ChiliIcon className="size-6 shrink-0" />}
        </a>
        <CopyButton
          toCopy={`https://l2beat.com/glossary#${props.entry.id}`}
          className="md:hidden md:animate-quick-fade-in md:group-hover:block"
        />
      </div>

      <p className="text-lg text-gray-850 dark:text-white">
        {props.entry.definition}
      </p>
    </section>
  )
}
