import React from 'react'

import { ReferenceList as ReferenceListComponent } from '../../../components/project/ReferenceList'

export default {
  title: 'Components/Project/ReferenceList',
}

export function ReferenceList() {
  return (
    <div className="leading-normal p-4">
      <ReferenceListComponent
        references={[
          {
            href: '#',
            text: 'Withdrawing back to L1 - Optimism Help Center',
          },
          {
            href: '#',
            text: 'mockOVM_BondManager.sol#L71 - Etherscan source code',
          },
        ]}
      />
    </div>
  )
}
