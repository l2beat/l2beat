import { DiscoveryDiff } from '@l2beat/discovery'
import { default as React } from 'react'

import { Page } from '../../../status/Page'
import { reactToHtml } from '../../../status/reactToHtml'
import { DashboardContract } from '../props/getDashboardContracts'
import { Contract } from './components/Contract'
import { Diff } from './components/Diff'
import { UnverifiedContract } from './components/UnverifiedContract'

interface ConfigPageProps {
  chain: string
  projectName: string
  contracts: DashboardContract[]
  diff?: DiscoveryDiff[]
}

export function DashboardProjectPage(props: ConfigPageProps) {
  return (
    <Page title={props.projectName + '@' + props.chain}>
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
