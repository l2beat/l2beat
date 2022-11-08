import React from 'react'

import { UnverifiedContractsWarning as UnverifiedContractsWarningComponent } from './UnverifiedContractsWarning'

export default {
  title: 'Components/UnverifiedContractsWarning',
}

export function UnverifiedContractsWarning() {
  return (
    <div className="p-10">
      <UnverifiedContractsWarningComponent />
    </div>
  )
}
