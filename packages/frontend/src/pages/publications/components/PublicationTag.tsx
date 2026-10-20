import type { PublicationEntry } from '../utils/getPublicationEntry'

export function PublicationTag({ tag }: { tag: PublicationEntry['tag'] }) {
  return (
    <div className="whitespace-nowrap rounded-sm border border-brand px-[5px] py-[4.5px] font-bold text-brand text-label-value-13 uppercase">
      {getPublicationTagLabel(tag)}
    </div>
  )
}

export function getPublicationTagLabel(tag: PublicationEntry['tag']) {
  return tag === 'monthly-update' ? 'Monthly Update' : tag
}
