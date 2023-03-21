import { default as React } from 'react'

import { DashboardContract } from '../../props/getProjectContracts'
import { DASHBOARD_COLORS } from '../constants'

interface TabProps {
  contract: DashboardContract
  tabIndex: number
  textColor?: string
}

export function Tab(props: TabProps) {
  return (
    <React.Fragment>
      <input
        type="radio"
        name="tabs"
        id={`tab-${props.tabIndex}`}
        defaultChecked={props.tabIndex === 0}
      />
      <label
        htmlFor={`tab-${props.tabIndex}`}
        id={props.contract.address.toString()}
        style={{
          color: props.contract.isInitial
            ? DASHBOARD_COLORS.INITIAL
            : props.textColor ?? '',
        }}
      >
        {props.contract.name
          ? props.contract.name
          : props.contract.address.slice(0, 10)}
      </label>
    </React.Fragment>
  )
}
