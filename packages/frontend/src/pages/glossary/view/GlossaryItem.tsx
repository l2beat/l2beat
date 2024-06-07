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
          className="peer flex items-center gap-2 font-bold text-2xl text-gray-850 no-underline dark:text-white"
        >
          {props.entry.term}
          {props.entry.isSpicy && <ChiliIcon className="shrink-0" />}
        </a>
        <CopyButton
          toCopy={`https://l2beat.com/glossary#${props.entry.id}`}
          className="md:group-hover:block md:hidden md:animate-quick-fade-in"
        />
      </div>

      <p className="text-gray-850 text-lg dark:text-white">
        {props.entry.definition}
      </p>
    </section>
  )
}
