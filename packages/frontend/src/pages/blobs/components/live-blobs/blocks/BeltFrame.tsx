import { Fragment, type ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'

/** Just tall enough for a full rack (at most 21 rows of 21 px) with its caption and numbers */
export const BELT_HEIGHT = 'h-[24rem] md:h-[34rem]'

/** Here rather than beside LivePulse, so the first-paint skeleton does not wait for the belt's code */
export function PulseSkeleton() {
  return <Skeleton className="h-14 w-full" />
}

export function BeltLegend() {
  return (
    <Legend
      items={[
        <>
          1 square = <LegendValue>1 blob</LegendValue>
        </>,
        <>
          1 column = <LegendValue>1 block</LegendValue>
        </>,
        <>
          Missed = <LegendValue>no block in the slot</LegendValue>
        </>,
      ]}
    />
  )
}

/** One item per line on a phone, as wrapped separators would start lines */
function Legend({ items }: { items: ReactNode[] }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-2 font-medium text-label-value-12 text-secondary max-md:hidden">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="text-tertiary">|</span>}
            <span>{item}</span>
          </Fragment>
        ))}
      </div>
      <div className="space-y-1 text-center font-medium text-label-value-14 text-secondary md:hidden">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </>
  )
}

function LegendValue({ children }: { children: ReactNode }) {
  return <span className="font-bold text-brand">{children}</span>
}
