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
      <a href="/status/discovery" key="back">
        ⬅ Back
      </a>
      <div className="tabs" style={{ marginTop: '8px' }}>
        {props.config.map((c, index) => {
          if (c.isUnverified) {
            return (
              <React.Fragment key={index}>
                <input type="radio" name="tabs" id={`tab-${index}`} />
                <label style={{ color: 'FF5733' }} htmlFor={`tab-${index}`}>
                  {c.addresses[0].slice(0, 10)}
                </label>
                <div className="tab" key={index}>
                  <div className="card warn">
                    <p>{c.addresses[0]}</p>
                    <p>
                      This contract does not have a verified source code on
                      Etherscan
                    </p>
                  </div>
                </div>
              </React.Fragment>
            )
          }
          return (
            <React.Fragment key={index}>
              <input
                type="radio"
                name="tabs"
                id={`tab-${index}`}
                defaultChecked={index === 0}
              />
              <label htmlFor={`tab-${index}`}>{c.name}</label>
              <div className="tab" key={index}>
                <blockquote>
                  <h4>
                    {c.name} <ProxyIndicator type={c.proxyType} />
                  </h4>
                  {c.addresses.map((a, index) => (
                    <p key={index}>
                      {index !== 0 && `Implementation #${index}: `}
                      <a href={`https://etherscan.io/address/${a.toString()}`}>
                        {a.toString()}
                      </a>
                    </p>
                  ))}
                </blockquote>
                {c.watched && (
                  <details style={{ paddingLeft: '16px' }} open>
                    <summary>Watched</summary>
                    <p>
                      {c.watched.map((i, index) => (
                        <p key={index}>
                          {i}
                          {c.overrides?.includes(i.split('(')[0]) && (
                            <OverrideIndicator />
                          )}
                        </p>
                      ))}
                    </p>
                  </details>
                )}
                {c.ignoreInWatchMode && (
                  <details style={{ paddingLeft: '16px' }} open>
                    <summary>Ignore in watch mode</summary>
                    <p>
                      {c.ignoreInWatchMode.map((i, index) => (
                        <p key={index}>{i}</p>
                      ))}
                    </p>
                  </details>
                )}
                {c.ignoreMethods && (
                  <details style={{ paddingLeft: '16px' }} open>
                    <p>
                      <summary>Ignored methods</summary>
                      {c.ignoreMethods.map((i, index) => (
                        <p key={index}>{i}</p>
                      ))}
                    </p>
                  </details>
                )}
                {c.rest && (
                  <details style={{ paddingLeft: '16px' }} open>
                    <p>
                      <summary>Not handled</summary>
                      {c.rest.map((i, index) => (
                        <p key={index}>{i}</p>
                      ))}
                    </p>
                  </details>
                )}
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </Page>
  )
}

export function renderDiscoveryConfigPage(props: ConfigPageProps) {
  return reactToHtml(<ConfigPage {...props} />)
}

function ProxyIndicator({ type }: { type?: string }) {
  if (type === 'immutable') {
    return null
  }
  return (
    <span
      style={{
        background: '#900C3F',
        borderRadius: '4px',
        padding: '2px 3px 3px 2px',
        marginLeft: '8px',
        fontSize: '12px',
      }}
    >
      {type}
    </span>
  )
}

function OverrideIndicator() {
  return (
    <span
      style={{
        background: 'grey',
        borderRadius: '4px',
        padding: '2px 3px 3px 2px',
        marginLeft: '8px',
        fontSize: '12px',
      }}
    >
      override
    </span>
  )
}
