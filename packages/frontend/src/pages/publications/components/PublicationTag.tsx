import type { PublicationEntry } from '../utils/getPublicationEntry'

/** Lives here, not next to the entries, which load server-only code. */
export function getPublicationTagLabel(tag: PublicationEntry['tag']) {
  if (tag === 'monthly-update') return 'Monthly update'
  if (tag === 'governance') return 'Governance'
  return tag
}

export function PublicationTag({ tag }: { tag: PublicationEntry['tag'] }) {
  return (
    <span className="whitespace-nowrap rounded-sm border border-brand px-[5px] py-[4.5px] font-bold text-brand-deep text-label-value-13 uppercase leading-none">
      {getPublicationTagLabel(tag)}
    </span>
  )
}
