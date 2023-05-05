import React from 'react'

import { RiskSection as RiskSectionComponent } from './RiskSection'

export default {
  title: 'Components/Project/RiskSection',
}

export function RiskSection() {
  return (
    <div className="p-4 leading-normal">
      <RiskSectionComponent
        id="risks"
        title="Risks summary"
        riskGroups={[
          {
            name: 'Funds can be stolen if',
            start: 1,
            items: [
              {
                text: 'an invalid state root is submitted to the system,',
                isCritical: true,
                referencedId: '',
              },
              {
                text: 'a contract receives a malicious code upgrade. There is no delay on code upgrades.',
                isCritical: true,
                referencedId: '',
              },
            ],
          },
          {
            name: 'Funds can be frozen if',
            start: 3,
            items: [
              {
                text: 'the centralized validator goes down. Users cannot produce blocks themselves and exiting the system requires new block production.',
                isCritical: true,
                referencedId: '',
              },
            ],
          },
          {
            name: 'MEV can be extracted if',
            start: 4,
            items: [
              {
                text: 'the operator exploits their centralized position and frontruns user transactions.',
                isCritical: false,
                referencedId: '',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
