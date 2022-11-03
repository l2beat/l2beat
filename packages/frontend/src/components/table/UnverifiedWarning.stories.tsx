import React from 'react'

import { UnverifiedWarning } from './UnverifiedWarning'

export default {
  title: 'Table/Unverified',
}

export function Unverified() {
  return (
    <div className="p-10">
      <UnverifiedWarning />
    </div>
  )
}
