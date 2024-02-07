import { DiscoveryDiff } from '@l2beat/discovery'
import { default as React } from 'react'

import { Page } from '../../view/Page'
import { reactToHtml } from '../../view/reactToHtml'
import { DashboardContract } from '../props/getDashboardContracts'
import { Contract } from './components/Contract'
import { Diff } from './components/Diff'
import { UnverifiedContract } from './components/UnverifiedContract'

interface ConfigPageProps {
  projectName: string
  contracts: DashboardContract[]
  diff?: DiscoveryDiff[]
}

export function DashboardProjectPage(props: ConfigPageProps) {
  return (
    <Page title={props.projectName}>
      <a href="/status/discovery">⬅ Back</a>

      {props.diff && (
        <details>
          <summary
            style={{ color: 'yellow', fontWeight: 'bold', fontSize: '24px' }}
          >
            ⚠️ Detected changes
          </summary>
          <p>
            {props.diff.map((d, index) => (
              <p style={{ marginTop: '8px' }} key={index}>
                <span style={{ fontWeight: 'bold' }}>
                  {d.name} - {d.address.toString()}
                </span>
                <br />
                <ul>
                  {(d.diff ?? []).map((x, index2) => (
                    <li key={index2} style={{ marginLeft: '12px' }}>
                      <Diff diff={x} />
                    </li>
                  ))}
                </ul>
              </p>
            ))}
          </p>
        </details>
      )}

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
