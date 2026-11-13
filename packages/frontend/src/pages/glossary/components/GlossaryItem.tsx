import { CopyButton } from '~/components/CopyButton'
import { toProductionUrl } from '~/consts/productionOrigin'
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
          className="flex items-center gap-2 font-semibold text-heading-20 leading-6 tracking-[-0.01em] no-underline"
        >
          {props.entry.data.term}
          {props.entry.data.isSpicy && (
            <ChiliIcon className="size-5 shrink-0" />
          )}
        </a>
        <CopyButton
          toCopy={toProductionUrl(`/glossary#${props.entry.id}`)}
          // With a mouse it shows on hover or focus; on touch, always.
          className="can-hover:group-hover:fade-in-0 can-hover:hidden can-hover:group-focus-within:block can-hover:group-hover:block can-hover:group-hover:animate-in"
          iconClassName="size-5"
        />
      </div>

      <p className="font-normal text-base text-primary leading-[170%] tracking-[-0.16px]">
        {props.entry.data.definition}
      </p>
    </section>
  )
}
