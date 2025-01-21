import { default as React } from 'react'

import type { DashboardContract } from '../../props/getDashboardContracts'
import { DASHBOARD_COLORS } from '../constants'
import { ContractName } from './ContractName'

interface TabProps {
  contract: DashboardContract
  tabIndex: number
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
            : props.contract.isUnverified
              ? DASHBOARD_COLORS.UNVERIFIED
              : '',
        }}
      >
        <ContractName contract={props.contract} />
      </label>
    </React.Fragment>
  )
}
