import { default as React } from 'react'

import { DashboardContract } from '../../props/getDashboardProject'
import { Header } from './Header'
import { Tab } from './Tab'

export function UnverifiedContract({
  c,
  index,
}: {
  c: DashboardContract
  index: number
}) {
  return (
    <React.Fragment>
      <Tab c={c} index={index} textColor={'#FF5733'} />
      <div className="tab">
        <Header c={c} />
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
