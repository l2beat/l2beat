import React from 'react'

import { ContractConfig } from '../getDiscoveryConfig'
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
          {c.watched && (
            <div style={{ paddingLeft: '16px' }}>
              <h4>Watched</h4>
              {c.watched.map((i, index) => (
                <p key={index}>
                  {i}
                  {c.overrides?.includes(i.split('(')[0]) && ' (o)'}
                </p>
              ))}
            </div>
          )}
          {c.ignoreInWatchMode && (
            <div style={{ paddingLeft: '16px' }}>
              <h4>Ignore in watch mode</h4>
              {c.ignoreInWatchMode.map((i, index) => (
                <p key={index}>{i}</p>
              ))}
            </div>
          )}
          {c.ignoreMethods && (
            <div style={{ paddingLeft: '16px' }}>
              <h4>Ignored methods</h4>
              {c.ignoreMethods.map((i, index) => (
                <p key={index}>{i}</p>
              ))}
            </div>
          )}
          {c.rest && (
            <div style={{ paddingLeft: '16px' }}>
              <h4>Functions</h4>
              {c.rest.map((i, index) => (
                <p key={index}>{i}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </Page>
  )
}

export function renderDiscoveryConfigPage(props: DiscoveryConfigPageProps) {
  return reactToHtml(<DiscoveryConfigPage {...props} />)
}
