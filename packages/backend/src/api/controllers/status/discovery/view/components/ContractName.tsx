import React from 'react'

import { DashboardContract } from '../../props/getDashboardContracts'

interface ContractNameProps {
  contract: DashboardContract
}

export function ContractName(props: ContractNameProps) {
  return (
    <span>
      {props.contract.name
        ? props.contract.name
        : props.contract.address.slice(0, 10)}
    </span>
  )
}
