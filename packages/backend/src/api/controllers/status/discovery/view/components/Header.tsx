import { default as React } from 'react'

import { DashboardContract } from '../../props/getDashboardProject'
import { DASHBOARD_COLORS } from '../constants'
import { ContractHref } from '../ContractHref'
import { Field } from './Field'
import { InitialIndicator, ProxyIndicator } from './Indicator'

export function Header({ c }: { c: DashboardContract }) {
  return (
    <blockquote>
      <h4>
        {c.name ? c.name : c.address.slice(0, 10)}{' '}
        <InitialIndicator isInitial={c.isInitial} />{' '}
        <ProxyIndicator type={c.proxyType} />
      </h4>
      <p>
        <a href={`https://etherscan.io/address/${c.address.toString()}`}>
          {c.address}
        </a>
      </p>
      {c.upgradeability.length > 0 && (
        <blockquote>
          Proxy parameters:{' '}
          {c.upgradeability.map((u, index) => (
            <Field field={u} color={DASHBOARD_COLORS.PROXY} key={index} />
          ))}
        </blockquote>
      )}
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
