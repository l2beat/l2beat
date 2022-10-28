import React from 'react'

import { InfoIcon } from '../icons'

export function UnverifiedWarning() {
  return (
    <span
      className="Tooltip inline-block"
      title={'This project includes unverified smart contracts!.'}
    >
      <InfoIcon width="16" height="16" viewBox="0 0 16 16" fill="#FF3F4A" />
    </span>
  )
}
