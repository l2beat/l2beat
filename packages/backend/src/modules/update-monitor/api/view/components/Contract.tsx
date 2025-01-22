import { default as React } from 'react'

import type { DashboardContract } from '../../props/getDashboardContracts'
import { DASHBOARD_COLORS } from '../constants'
import { Header } from './Header'
import { Section } from './Section'
import { Tab } from './Tab'

interface ContractProps {
  tabIndex: number
  contract: DashboardContract
}

export function Contract(props: ContractProps) {
  return (
    <React.Fragment>
      <Tab contract={props.contract} tabIndex={props.tabIndex} />
      <div className="tab">
        <Header contract={props.contract} />
        {props.contract.watched && (
          <Section
            title="Watched"
            color={DASHBOARD_COLORS.WATCHED}
            fields={props.contract.watched}
          />
        )}
        {props.contract.ignoreInWatchMode && (
          <Section
            title="Ignore in watch mode"
            color={DASHBOARD_COLORS.IGNORED_IN_WATCH_MODE}
            fields={props.contract.ignoreInWatchMode}
          />
        )}
        {props.contract.ignoreMethods && (
          <Section
            title="Ignored methods"
            color={DASHBOARD_COLORS.IGNORED}
            fields={props.contract.ignoreMethods}
          />
        )}
        {props.contract.notHandled && (
          <Section
            title="Not handled"
            color={DASHBOARD_COLORS.NOT_HANDLED}
            fields={props.contract.notHandled}
          />
        )}
      </div>
    </React.Fragment>
  )
}
