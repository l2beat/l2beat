import { default as React } from 'react'

import type { DashboardContract } from '../../props/getDashboardContracts'
import { DASHBOARD_COLORS } from '../constants'
import { ContractHref } from './ContractHref'
import { ContractName } from './ContractName'
import { EtherscanLink } from './EtherscanLink'
import { Field } from './Field'
import { InitialIndicator, ProxyIndicator } from './Indicators'

export interface HeaderProps {
  contract: DashboardContract
}

export function Header(props: HeaderProps) {
  return (
    <blockquote>
      <h4>
        <ContractName contract={props.contract} showDerivedName={true} />
        <InitialIndicator isInitial={props.contract.isInitial} />
        <ProxyIndicator type={props.contract.proxyType} />
      </h4>
      {props.contract.description && (
        <p>
          <i style={{ color: DASHBOARD_COLORS.COMMENT }}>
            {props.contract.description}
          </i>
        </p>
      )}
      <p>
        <EtherscanLink address={props.contract.address} />
      </p>
      {props.contract.upgradeabilityParams.length > 0 && (
        <blockquote>
          Proxy parameters:{' '}
          {props.contract.upgradeabilityParams.map((u, index) => (
            <Field field={u} color={DASHBOARD_COLORS.PROXY} key={index} />
          ))}
        </blockquote>
      )}
      {props.contract.discoveredBy.length > 0 && (
        <blockquote>
          Discovered by:
          {props.contract.discoveredBy.map((d, index) => (
            <ContractHref key={index} address={d.address} name={d.name} />
          ))}
        </blockquote>
      )}
    </blockquote>
  )
}
