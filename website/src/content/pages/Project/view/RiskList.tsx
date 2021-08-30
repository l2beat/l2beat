import React from 'react'

import { ShieldBadIcon, ShieldWarnIcon } from '../../../common/icons'
import { InlineReferences } from './InlineReferences'

export interface RiskList {
  risks: TechnologyRisk[]
}

export interface TechnologyRisk {
  text: string
  referenceIds: number[]
  isCritical: boolean
}

export function RiskList({ risks }: RiskList) {
  return (
    <ul className="RiskList">
      {risks.map((risk, i) => (
        <li className="RiskList-Item" key={i}>
          {risk.isCritical ? (
            <>
              <ShieldBadIcon />
              {risk.text.slice(0, -1)} <strong>(CRITICAL)</strong>
              {risk.text.slice(-1)}
            </>
          ) : (
            <>
              <ShieldWarnIcon />
              {risk.text}
            </>
          )}
          <InlineReferences ids={risk.referenceIds} />
        </li>
      ))}
    </ul>
  )
}
