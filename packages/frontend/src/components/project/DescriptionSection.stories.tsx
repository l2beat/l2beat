import React from 'react'

import { DescriptionSection as DescriptionSectionComponent } from './DescriptionSection'

export default {
  title: 'Components/Project/DescriptionSection',
}

export function DescriptionSection() {
  return (
    <div className="leading-normal p-4">
      <DescriptionSectionComponent
        description='Optimistic Ethereum is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure. With the Nov 2021 upgrade to "EVM equivalent" OVM 2.0 old fraud proof system has been disabled while the new fraud-proof system is being built (https://github.com/geohot/cannon).'
        warning="Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots."
        issueLink="#"
        editLink="#"
      />
    </div>
  )
}
