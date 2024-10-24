import { type Sentiment } from '@l2beat/shared-pure'
import { SingleGrissini } from './single-grissini'

export function Grissini<T extends { sentiment: Sentiment }[]>({
  items,
}: {
  items: T
}) {
  return (
    <div className="flex gap-x-1">
      {items.map((item, i) => (
        <SingleGrissini key={i} sentiment={item.sentiment} />
      ))}
    </div>
  )
}
