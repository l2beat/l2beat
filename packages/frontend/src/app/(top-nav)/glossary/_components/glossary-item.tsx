import { CopyButton } from '~/components/copy-button'
import type { CollectionEntry } from '~/content/get-collection'
import { ChiliIcon } from '~/icons/chili'

interface Props {
  entry: CollectionEntry<'glossary'>
}

export function GlossaryItem(props: Props) {
  return (
    <section className="mt-12 first:mt-0" id={props.entry.id}>
      <div className="group flex items-center gap-2 pb-4 text-gray-850 dark:text-white">
        <a
          href={`#${props.entry.id}`}
          className="peer flex items-center gap-2 text-2xl font-bold no-underline"
        >
          {props.entry.data.term}
          {props.entry.data.isSpicy && (
            <ChiliIcon className="size-6 shrink-0" />
          )}
        </a>
        <CopyButton
          toCopy={`https://l2beat.com/glossary#${props.entry.id}`}
          className="md:hidden md:group-hover:block md:group-hover:animate-in md:group-hover:fade-in-0"
          iconClassName="size-5"
        />
      </div>

      <p className="text-lg text-gray-850 dark:text-white">
        {props.entry.data.definition}
      </p>
    </section>
  )
}
