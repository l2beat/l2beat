import React from 'react'

import { RiskList as RiskListComponent } from './RiskList'

export default {
  title: 'Components/Project/RiskList',
}

export function RiskList() {
  return (
    <div className="p-4 leading-normal">
      <RiskListComponent
        risks={[
          {
            text: 'Funds can be stolen if a contract receives a malicious code upgrade. There is no delay on code upgrades.',
            isCritical: true,
          },
          {
            text: 'MEV can be extracted if the operator exploits their centralized position and frontruns user transactions.',
            isCritical: false,
          },
        ]}
      />
    </div>
  )
}
