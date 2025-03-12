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
      className: 'bg-[hsl(var(--chart-costs-calldata))]',
    },
    props.blobs && {
      value: props.blobs,
      className: 'bg-[hsl(var(--chart-costs-blobs))]',
    },
    props.compute && {
      value: props.compute,
      className: 'bg-[hsl(var(--chart-costs-compute))]',
    },
    props.overhead && {
      value: props.overhead,
      className: 'bg-[hsl(var(--chart-costs-overhead))]',
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
