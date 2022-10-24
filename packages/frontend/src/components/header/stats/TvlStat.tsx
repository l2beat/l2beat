import React from 'react'

import { PercentChange } from '../../PercentChange'

interface TvlStatProps {
  tvl: string
  sevenDaysChange: string
}

export function TvlStat(props: TvlStatProps) {
  return (
    <>
      <span className="font-bold mr-2">{props.tvl}</span>
      <span className="text-base">
        <PercentChange value={props.sevenDaysChange} />
      </span>
    </>
  )
}
