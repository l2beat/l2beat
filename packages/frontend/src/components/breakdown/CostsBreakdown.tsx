import compact from 'lodash/compact'
import React from 'react'

import { Breakdown } from './Breakdown'

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
      className: 'dark:bg-sky-500 bg-sky-550',
    },
    props.blobs && {
      value: props.blobs,
      className: 'dark:bg-yellow-100 bg-orange-400',
    },
    props.compute && {
      value: props.compute,
      className: 'bg-pink-100',
    },
    props.overhead && {
      value: props.overhead,
      className: 'bg-purple-100',
    },
  ])

  return <Breakdown className="h-[3px] w-[119px]" gap={1} values={groups} />
}
