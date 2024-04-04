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
      className: 'dark:fill-sky-500 fill-sky-550',
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
      className: 'fill-purple-100',
    },
  ])

  return <Breakdown height={3} width={119} values={groups} barGap={1} />
}
