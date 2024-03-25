import compact from 'lodash/compact'
import React from 'react'

import { Breakdown } from './breakdown/Breakdown'

interface CostsBreakdownProps {
  blobs: number | undefined
  calldata: number
  compute: number
  overhead: number
}

export function CostsBreakdown(props: CostsBreakdownProps) {
  const groups = compact([
    {
      value: props.calldata,
      className: 'dark:fill-blue-400 fill-blue-700',
    },
    props.blobs && {
      value: props.blobs,
      className: 'dark:fill-yellow-100 fill-orange-400',
    },
    {
      value: props.compute,
      className: 'fill-pink-100',
    },
    { value: props.overhead, className: 'fill-green-500' },
  ])

  return <Breakdown height={3} width={136} values={groups} barGap={1} />
}
