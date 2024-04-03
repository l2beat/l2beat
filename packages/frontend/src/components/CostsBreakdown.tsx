import compact from 'lodash/compact'
import React from 'react'

import { Breakdown } from './breakdown/Breakdown'

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
      className: 'dark:fill-blue-500 fill-blue-700',
    },
    props.blobs && {
      value: props.blobs,
      className: 'dark:fill-yellow-100 fill-orange-400',
    },
    props.compute && {
      value: props.compute,
      className: 'fill-pink-100',
    },
    props.overhead && {
      value: props.overhead,
      className: 'fill-green-600 dark:fill-green-500',
    },
  ])

  return <Breakdown height={3} width={136} values={groups} barGap={1} />
}
