import { default as React } from 'react'

import { DashboardContract } from '../../props/getProjectContracts'
import { DASHBOARD_COLORS } from '../constants'
import { Header } from './Header'
import { Section } from './Section'
import { Tab } from './Tab'

export function Contract({
  index,
  contract,
}: {
  index: number
  contract: DashboardContract
}) {
  return (
    <React.Fragment>
      <Tab contract={contract} index={index} />
      <div className="tab" id={contract.address.toString()}>
        <Header c={contract} />
        {contract.watched && (
          <Section
            title="Watched"
            color={DASHBOARD_COLORS.WATCHED}
            fields={contract.watched}
          />
        )}
        {contract.ignoreInWatchMode && (
          <Section
            title="Ignore in watch mode"
            color={DASHBOARD_COLORS.IGNORED_IN_WATCH_MODE}
            fields={contract.ignoreInWatchMode}
          />
        )}
        {contract.ignoreMethods && (
          <Section
            title="Ignored methods"
            color={DASHBOARD_COLORS.IGNORED}
            fields={contract.ignoreMethods}
          />
        )}
        {contract.notHandled && (
          <Section
            title="Not handled"
            color={DASHBOARD_COLORS.NOT_HANDLED}
            fields={contract.notHandled}
          />
        )}
      </div>
    </React.Fragment>
  )
}
