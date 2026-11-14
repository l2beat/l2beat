import type { PublicationEntry } from '../utils/getPublicationEntry'

/** Lives here, not next to the entries, which load server-only code. */
export function getPublicationTagLabel(tag: PublicationEntry['tag']) {
  if (tag === 'monthly-update') return 'Monthly update'
  if (tag === 'governance') return 'Governance'
  return tag
}

/** The category is a key, so it stays ink; the meta beside it is secondary. */
export function PublicationTag({ tag }: { tag: PublicationEntry['tag'] }) {
  return (
    <span className="whitespace-nowrap font-medium text-label-value-13 text-primary">
      {getPublicationTagLabel(tag)}
    </span>
  )
}
