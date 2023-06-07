import React from 'react'

import { StageBadge } from './StageBadge'

export default {
  title: 'Components/Stages',
}

export function Badge() {
  return (
    <div className="m-4 ml-32">
      <StageBadge category="Stage 1" />
    </div>
  )
}
