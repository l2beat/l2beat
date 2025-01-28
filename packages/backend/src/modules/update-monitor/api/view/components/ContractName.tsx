import React from 'react'

import type { DashboardContract } from '../../props/getDashboardContracts'
import { DASHBOARD_COLORS } from '../constants'

interface ContractNameProps {
  contract: DashboardContract
  showDerivedName?: boolean
}

export function ContractName(props: ContractNameProps) {
  return (
    <span>
      {props.contract.name
        ? props.contract.name
        : props.contract.address.slice(0, 10)}
      {props.showDerivedName && (
        <span style={{ color: DASHBOARD_COLORS.VALUE }}>
          {props.contract.derivedName ? ` (${props.contract.derivedName})` : ''}
        </span>
      )}
    </span>
  )
}
