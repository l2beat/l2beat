import { ContractValue } from '@l2beat/shared'
import { isArray } from 'lodash'
import { default as React } from 'react'

import {
  DashboardContract,
  DashboardContractField,
} from '../../discovery/getDiscoveryConfig'
import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'
import { DASHBOARD_COLORS } from './types'

interface ConfigPageProps {
  project: string
  config: DashboardContract[]
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
            return <UnverifiedContract c={c} index={index} />
          }
          return (
            <React.Fragment key={index}>
              <Tab c={c} index={index} />
              <div className="tab" key={index} id={c.addresses[0].toString()}>
                <Header c={c} />
                {c.watched && (
                  <Section
                    title="Watched"
                    color={DASHBOARD_COLORS.WATCHED}
                    fields={c.watched}
                  />
                )}
                {c.ignoreInWatchMode && (
                  <Section
                    title="Ignore in watch mode"
                    color={DASHBOARD_COLORS.IGNORED_IN_WATCH_MODE}
                    fields={c.ignoreInWatchMode}
                  />
                )}
                {c.ignoreMethods && (
                  <Section
                    title="Ignored methods"
                    color={DASHBOARD_COLORS.IGNORED}
                    fields={c.ignoreMethods}
                  />
                )}
                {c.notHandled && (
                  <Section
                    title="Not handled"
                    color={DASHBOARD_COLORS.NOT_HANDLED}
                    fields={c.notHandled}
                  />
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

function UnverifiedContract({
  c,
  index,
}: {
  c: DashboardContract
  index: number
}) {
  return (
    <React.Fragment key={index}>
      <Tab c={c} index={index} textColor={'#FF5733'} />
      <div className="tab" key={index}>
        <Header c={c} />
        <div className="card warn">
          <p>!!! UNVERIFIED CONTRACT !!!</p>
          <p>This contract does not have a verified source code on Etherscan</p>
        </div>
      </div>
    </React.Fragment>
  )
}

function Tab({
  c,
  index,
  textColor,
}: {
  c: DashboardContract
  index: number
  textColor?: string
}) {
  return (
    <React.Fragment>
      <input
        type="radio"
        name="tabs"
        id={`tab-${index}`}
        defaultChecked={index === 0}
      />
      <label
        htmlFor={`tab-${index}`}
        id={c.addresses[0].toString()}
        style={{
          color: c.isInitial ? DASHBOARD_COLORS.INITIAL : textColor ?? '',
        }}
      >
        {c.name ? c.name : c.addresses[0].slice(0, 10)}
      </label>
    </React.Fragment>
  )
}

function Header({ c }: { c: DashboardContract }) {
  return (
    <blockquote>
      <h4>
        {c.name ? c.name : c.addresses[0].slice(0, 10)}{' '}
        <InitialIndicator isInitial={c.isInitial} />{' '}
        <ProxyIndicator type={c.proxyType} />
      </h4>
      {c.addresses.map((a, index) => (
        <p key={index}>
          {index !== 0 && `Implementation #${index}: `}
          <a href={`https://etherscan.io/address/${a.toString()}`}>
            {a.toString()}
          </a>
        </p>
      ))}
      {(c.discoveredBy ?? []).length > 0 && (
        <blockquote>
          Discovered by:
          {c.discoveredBy?.map((d, index) => (
            <ContractHref key={index} address={d.address} name={d.name} />
          ))}
        </blockquote>
      )}
    </blockquote>
  )
}

function ContractHref(props: { address: string; name: string }) {
  return (
    <p
      dangerouslySetInnerHTML={{
        __html: `<span style="cursor:pointer; color: #85C1E9" onclick="document.getElementById('${props.address}').click()">⬆️ ${props.name}</span>`,
      }}
    />
  )
}

function Section({
  title,
  color,
  fields,
}: {
  title: string
  color: string
  fields: DashboardContractField[]
}) {
  return (
    <details style={{ paddingLeft: '16px', color }} open>
      <summary style={{ color: 'inherit' }}>{title}</summary>
      <p style={{ margin: '0px' }}>
        {fields.map((field, index) => (
          <p
            id={field.name}
            key={index}
            style={{ marginTop: '2px', marginBottom: '2px' }}
          >
            <Field value={field.value} name={field.name} color={color} />
          </p>
        ))}
      </p>
    </details>
  )
}

function ProxyIndicator({ type }: { type?: string }) {
  if (type === undefined || type === 'immutable') {
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

function InitialIndicator({ isInitial }: { isInitial?: boolean }) {
  if (!isInitial) {
    return null
  }
  return (
    <span
      style={{
        background: '#F7DC6F',
        color: 'black',
        borderRadius: '4px',
        padding: '2px 3px 3px 2px',
        marginLeft: '8px',
        fontSize: '12px',
      }}
    >
      initial
    </span>
  )
}

function Field({
  value,
  name,
  color,
}: {
  value: ContractValue | undefined
  name: string
  color: string
}) {
  if (value === undefined) return null

  if (isArray(value)) {
    return (
      <details style={{ paddingLeft: '16px', color }}>
        <summary style={{ color: 'inherit' }}>
          {name}
          {' (array)'}
        </summary>
        <p style={{ margin: '0px' }}>
          {value.map((element, index) => (
            <p
              key={index}
              style={{
                marginTop: '2px',
                marginBottom: '2px',
                color: '#939292',
              }}
            >
              {element.toString()}
            </p>
          ))}
        </p>
      </details>
    )
  }

  return (
    <span style={{ color, marginLeft: '8px' }}>
      {name}
      <span style={{ color: '#939292' }}> {value.toString()}</span>
    </span>
  )
}
