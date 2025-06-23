import { CopyButton } from '~/components/CopyButton'
import type { CollectionEntry } from '~/content/getCollection'
import { ChiliIcon } from '~/icons/Chili'

interface Props {
  entry: CollectionEntry<'glossary'>
}

export function GlossaryItem(props: Props) {
  return (
    <section
      className="mt-6 scroll-m-20 first:mt-0 md:scroll-mt-[115px]"
      id={props.entry.id}
    >
      <div className="group flex items-center gap-2 pb-2 text-primary">
        <a
          href={`#${props.entry.id}`}
          className="flex items-center gap-2 font-bold text-2xl leading-[115%] no-underline"
        >
          {props.entry.data.term}
          {props.entry.data.isSpicy && (
            <ChiliIcon className="size-6 shrink-0" />
          )}
        </a>
        <CopyButton
          toCopy={`https://l2beat.com/glossary#${props.entry.id}`}
          className="md:group-hover:fade-in-0 md:hidden md:group-hover:block md:group-hover:animate-in"
          iconClassName="size-5"
        />
      </div>

      <p className="font-normal text-base text-secondary leading-[170%] tracking-[-0.16px]">
        {props.entry.data.definition}
      </p>
    </section>
  )
}
