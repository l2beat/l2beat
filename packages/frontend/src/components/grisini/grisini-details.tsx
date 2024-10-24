import { SingleGrisiniDetails } from './single-grisini-details'
import { type GrisiniValue } from './types'

export function GrisiniDetails({ items }: { items: GrisiniValue[] }) {
  return (
    <div className="flex w-[264px] flex-col gap-4">
      {items.map((item) => (
        <SingleGrisiniDetails key={item.name} {...item} />
      ))}
    </div>
  )
}
