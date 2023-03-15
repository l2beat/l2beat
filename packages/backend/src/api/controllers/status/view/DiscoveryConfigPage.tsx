import { EthereumAddress } from '@l2beat/shared'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

interface DiscoveryConfigPageProps {
  project: string
  config: ContractConfig[]
}

export function DiscoveryConfigPage(props: DiscoveryConfigPageProps) {
  return (
    <Page title={props.project}>
      {props.config.map((c, index) => (
        <div key={index}>
          <h3>{c.name}</h3>
          <p>{c.address}</p>
        </div>
      ))}
    </Page>
  )
}

export function renderDiscoveryConfigPage(props: DiscoveryConfigPageProps) {
  return reactToHtml(<DiscoveryConfigPage {...props} />)
}
