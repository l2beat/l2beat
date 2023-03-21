import { default as React } from 'react'

import { DashboardContract } from '../../props/getDashboardProject'
import { DASHBOARD_COLORS } from '../constants'
import { Header } from './Header'
import { Section } from './Section'
import { Tab } from './Tab'

export function Contract({
  index,
  c,
}: {
  index: number
  c: DashboardContract
}): JSX.Element {
  return (
    <React.Fragment key={index}>
      <Tab c={c} index={index} />
      <div className="tab" key={index} id={c.address.toString()}>
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
}
