import React from 'react'

import { ContractConfig } from '../../discovery/getDiscoveryConfig'
import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'

interface ConfigPageProps {
  project: string
  config: ContractConfig[]
}

export function ConfigPage(props: ConfigPageProps) {
  return (
    <Page title={props.project}>
      <div className="tabs">
        {props.config.map((c, index) => (
          <>
            <input type="radio" name="tabs" id={`tab-${index}`} />
            <label htmlFor={`tab-${index}`}>{c.name}</label>
            <div className="tab" key={index}>
              <blockquote>
                <h4>{c.name}</h4>
                <p>{c.address}</p>
              </blockquote>
              {c.watched && (
                <details style={{ paddingLeft: '16px' }}>
                  <summary>Watched</summary>
                  <p>
                    {c.watched.map((i, index) => (
                      <p key={index}>
                        {i}
                        {c.overrides?.includes(i.split('(')[0]) && ' (o)'}
                      </p>
                    ))}
                  </p>
                </details>
              )}
              {c.ignoreInWatchMode && (
                <details style={{ paddingLeft: '16px' }}>
                  <summary>Ignore in watch mode</summary>
                  <p>
                    {c.ignoreInWatchMode.map((i, index) => (
                      <p key={index}>{i}</p>
                    ))}
                  </p>
                </details>
              )}
              {c.ignoreMethods && (
                <details style={{ paddingLeft: '16px' }}>
                  <p>
                    <summary>Ignored methods</summary>
                    {c.ignoreMethods.map((i, index) => (
                      <p key={index}>{i}</p>
                    ))}
                  </p>
                </details>
              )}
              {c.rest && (
                <details style={{ paddingLeft: '16px' }}>
                  <p>
                    <summary>Not handled</summary>
                    {c.rest.map((i, index) => (
                      <p key={index}>{i}</p>
                    ))}
                  </p>
                </details>
              )}
            </div>
          </>
        ))}
      </div>
    </Page>
  )
}

export function renderDiscoveryConfigPage(props: ConfigPageProps) {
  return reactToHtml(<ConfigPage {...props} />)
}
