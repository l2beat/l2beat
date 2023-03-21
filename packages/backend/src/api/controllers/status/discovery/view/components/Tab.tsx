import { default as React } from 'react'

import { DashboardContract } from '../../props/getDashboardProject'
import { DASHBOARD_COLORS } from '../constants'

export function Tab({
  c,
  index,
  textColor,
}: {
  c: DashboardContract
  index: number
  textColor?: string
}) {
  return (
    <React.Fragment>
      <input
        type="radio"
        name="tabs"
        id={`tab-${index}`}
        defaultChecked={index === 0}
      />
      <label
        htmlFor={`tab-${index}`}
        id={c.address.toString()}
        style={{
          color: c.isInitial ? DASHBOARD_COLORS.INITIAL : textColor ?? '',
        }}
      >
        {c.name ? c.name : c.address.slice(0, 10)}
      </label>
    </React.Fragment>
  )
}
