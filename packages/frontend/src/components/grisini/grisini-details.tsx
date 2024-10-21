import { SingleGrisiniDetails } from './single-grisini-details'
import { GrisiniValue } from './types'

export function GrisiniDetails({ items }: { items: GrisiniValue[] }) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[264px]">
      {items.map((item) => (
        <SingleGrisiniDetails {...item} />
      ))}
    </div>
  )
}
