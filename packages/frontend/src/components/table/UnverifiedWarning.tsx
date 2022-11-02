import React from 'react'

import { InfoIcon } from '../icons'

export interface UnverifiedWarningProps {
  message: string
}

export function UnverifiedWarning({ message }: UnverifiedWarningProps) {
  return (
    <span className="Tooltip inline-block" title={message}>
      <InfoIcon width="16" height="16" viewBox="0 0 16 16" fill="#FF3F4A" />
    </span>
  )
}
