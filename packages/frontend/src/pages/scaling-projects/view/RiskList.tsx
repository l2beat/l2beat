import React from 'react'

import { ShieldBadIcon, ShieldWarnIcon } from '../../../components/icons'

export interface RiskList {
  risks: TechnologyRisk[]
}

export interface TechnologyRisk {
  text: string
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
        </li>
      ))}
    </ul>
  )
}
