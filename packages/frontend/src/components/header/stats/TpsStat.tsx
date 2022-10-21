import React from 'react'

import { PercentChange } from '../../PercentChange'

interface TpsStatProps {
  tps: string
  sevenDaysChange: string
}

export function TpsStat(props: TpsStatProps) {
  return (
    <>
      <span className="mr-2">{props.tps}</span>
      <PercentChange value={props.sevenDaysChange} />
    </>
  )
}
