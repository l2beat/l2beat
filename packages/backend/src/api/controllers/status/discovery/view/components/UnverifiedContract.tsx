import React from 'react'

import { DashboardContract } from '../../props/getProjectContracts'
import { Header } from './Header'
import { Tab } from './Tab'

export function UnverifiedContract({
  contract,
  index,
}: {
  contract: DashboardContract
  index: number
}) {
  return (
    <React.Fragment>
      <Tab contract={contract} index={index} textColor={'#FF5733'} />
      <div className="tab">
        <Header c={contract} />
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
