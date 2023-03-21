import { default as React } from 'react'

import { DashboardContract } from '../../props/getProjectContracts'
import { DASHBOARD_COLORS } from '../constants'
import { ContractHref } from '../ContractHref'
import { Field } from './Field'
import { InitialIndicator, ProxyIndicator } from './Indicators'

interface HeaderProps {
  contract: DashboardContract
}

export function Header(props: HeaderProps) {
  return (
    <blockquote>
      <h4>
        {props.contract.name
          ? props.contract.name
          : props.contract.address.slice(0, 10)}{' '}
        <InitialIndicator isInitial={props.contract.isInitial} />{' '}
        <ProxyIndicator type={props.contract.proxyType} />
      </h4>
      <p>
        <a
          href={`https://etherscan.io/address/${props.contract.address.toString()}`}
        >
          {props.contract.address}
        </a>
      </p>
      {props.contract.upgradeability.length > 0 && (
        <blockquote>
          Proxy parameters:{' '}
          {props.contract.upgradeability.map((u, index) => (
            <Field field={u} color={DASHBOARD_COLORS.PROXY} key={index} />
          ))}
        </blockquote>
      )}
      {(props.contract.discoveredBy ?? []).length > 0 && (
        <blockquote>
          Discovered by:
          {props.contract.discoveredBy?.map((d, index) => (
            <ContractHref key={index} address={d.address} name={d.name} />
          ))}
        </blockquote>
      )}
    </blockquote>
  )
}
