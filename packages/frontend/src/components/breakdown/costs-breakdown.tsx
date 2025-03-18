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
      className: 'bg-chart-stacked-blue',
    },
    props.blobs && {
      value: props.blobs,
      className: 'bg-chart-stacked-yellow',
    },
    props.compute && {
      value: props.compute,
      className: 'bg-chart-stacked-pink',
    },
    props.overhead && {
      value: props.overhead,
      className: 'bg-chart-stacked-purple',
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
