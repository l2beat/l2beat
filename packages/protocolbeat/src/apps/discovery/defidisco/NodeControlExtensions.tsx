import React from 'react'
import { ExternalButton } from './ExternalButton'
import { FundsTagsButton } from './FundsTagsButton'
import { GovernanceButton } from './GovernanceButton'

export function NodeControlExtensions() {
  return (
    <>
      <ExternalButton />
      <GovernanceButton />
      <FundsTagsButton />
    </>
  )
}
