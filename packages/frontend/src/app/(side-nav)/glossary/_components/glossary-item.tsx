import { CopyButton } from '~/components/copy-button'
import type { CollectionEntry } from '~/content/get-collection'
import { ChiliIcon } from '~/icons/chili'

interface Props {
  entry: CollectionEntry<'glossary'>
}

export function GlossaryItem(props: Props) {
  return (
    <section
      className="mt-6 scroll-m-12 first:mt-0 md:scroll-mt-24"
      id={props.entry.id}
    >
      <div className="group flex items-center gap-2 pb-2 text-primary">
        <a
          href={`#${props.entry.id}`}
          className="flex items-center gap-2 text-2xl font-bold leading-[115%] no-underline"
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

      <p className="text-base font-normal leading-[170%] tracking-[-0.16px] text-secondary">
        {props.entry.data.definition}
      </p>
    </section>
  )
}
