import { default as React } from 'react'

import { Page } from '../../view/Page'
import { reactToHtml } from '../../view/reactToHtml'
import { DashboardContract } from '../props/getDashboardProject'
import { Contract } from './components/Contract'
import { UnverifiedContract } from './components/UnverifiedContract'

interface ConfigPageProps {
  project: string
  config: DashboardContract[]
}

export function DashboardProjectPage(props: ConfigPageProps) {
  return (
    <Page title={props.project}>
      <a href="/status/discovery">⬅ Back</a>

      <div className="tabs" style={{ marginTop: '8px' }}>
        {props.config.map((c, index) => {
          if (c.isUnverified) {
            return <UnverifiedContract c={c} index={index} key={index} />
          }
          return <Contract index={index} c={c} key={index} />
        })}
      </div>
    </Page>
  )
}

export function renderDiscoveryConfigPage(props: ConfigPageProps) {
  return reactToHtml(<DashboardProjectPage {...props} />)
}
