import { default as React } from 'react'

import { Page } from '../../view/Page'
import { reactToHtml } from '../../view/reactToHtml'
import { DashboardContract } from '../props/getDashboardContracts'
import { Contract } from './components/Contract'
import { UnverifiedContract } from './components/UnverifiedContract'

interface ConfigPageProps {
  projectName: string
  contracts: DashboardContract[]
}

export function DashboardProjectPage(props: ConfigPageProps) {
  return (
    <Page title={props.projectName}>
      <a href="/status/discovery">⬅ Back</a>

      <div className="tabs" style={{ marginTop: '8px' }}>
        {props.contracts.map((contract, index) =>
          contract.isUnverified ? (
            <UnverifiedContract
              contract={contract}
              tabIndex={index}
              key={index}
            />
          ) : (
            <Contract contract={contract} tabIndex={index} key={index} />
          ),
        )}
      </div>
    </Page>
  )
}

export function renderDashboardProjectPage(props: ConfigPageProps) {
  return reactToHtml(<DashboardProjectPage {...props} />)
}
