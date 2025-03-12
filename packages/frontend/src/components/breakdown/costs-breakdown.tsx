import compact from 'lodash/compact'

import { Breakdown } from './breakdown'

interface CostsBreakdownProps {
  blobs: number | undefined
  calldata: number | undefined
  compute: number | undefined
  overhead: number | undefined
}

export function CostsBreakdown(props: CostsBreakdownProps) {
  const groups = compact([
    props.calldata && {
      value: props.calldata,
      className: 'bg-[hsl(var(--chart-stacked-blue))]',
    },
    props.blobs && {
      value: props.blobs,
      className: 'bg-[hsl(var(--chart-stacked-yellow))]',
    },
    props.compute && {
      value: props.compute,
      className: 'bg-[hsl(var(--chart-stacked-pink))]',
    },
    props.overhead && {
      value: props.overhead,
      className: 'bg-[hsl(var(--chart-stacked-purple))]',
    },
  ])

  return (
    <Breakdown
      className="h-[3px] w-[119px] xl:w-[180px]"
      gap={1}
      values={groups}
    />
  )
}
