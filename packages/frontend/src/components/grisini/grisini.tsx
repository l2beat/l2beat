import { Sentiment } from '@l2beat/shared-pure'
import { SingleGrisini } from './single-grisini'

export function Grisini<T extends { sentiment: Sentiment }[]>({
  items,
}: {
  items: T
}) {
  return (
    <div className="flex gap-x-1">
      {items.map((item) => (
        <SingleGrisini sentiment={item.sentiment} />
      ))}
    </div>
  )
}
