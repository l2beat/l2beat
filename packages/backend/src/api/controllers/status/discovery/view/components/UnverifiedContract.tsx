import React from 'react'

import { DashboardContract } from '../../props/getProjectContracts'
import { Header } from './Header'
import { Tab } from './Tab'

interface UnverifiedContractProps {
  contract: DashboardContract
  tabIndex: number
}

export function UnverifiedContract(props: UnverifiedContractProps) {
  return (
    <React.Fragment>
      <Tab
        contract={props.contract}
        tabIndex={props.tabIndex}
        textColor={'#FF5733'}
      />
      <div className="tab">
        <Header contract={props.contract} />
        <div className="card warn">
          <p>
            !!! UNVERIFIED CONTRACT !!!
            <br />
            This contract does not have a verified source code on Etherscan
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}
