import { SingleGrissiniDetails } from './single-grissini-details'
import { type GrissiniValue } from './types'

export function GrissiniDetails({ items }: { items: GrissiniValue[] }) {
  return (
    <div className="flex w-[264px] flex-col gap-4">
      {items.map((item) => (
        <SingleGrissiniDetails key={item.name} {...item} />
      ))}
    </div>
  )
}
