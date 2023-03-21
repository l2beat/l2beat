import { default as React } from 'react'

import { DashboardContract } from '../../props/getProjectContracts'
import { DASHBOARD_COLORS } from '../constants'

export function Tab({
  contract,
  index,
  textColor,
}: {
  contract: DashboardContract
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
        id={contract.address.toString()}
        style={{
          color: contract.isInitial
            ? DASHBOARD_COLORS.INITIAL
            : textColor ?? '',
        }}
      >
        {contract.name ? contract.name : contract.address.slice(0, 10)}
      </label>
    </React.Fragment>
  )
}
