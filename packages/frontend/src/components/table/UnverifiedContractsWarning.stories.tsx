import React from 'react'

import { UnverifiedContractsWarning as UnverifiedContractsWarningComponent } from './UnverifiedContractsWarning'

export default {
  title: 'Components/Table/UnverifiedContractsWarning',
}

export function UnverifiedContractsWarning() {
  return (
    <div className="p-10">
      <UnverifiedContractsWarningComponent tooltip="This is tooltip message" />
    </div>
  )
}
