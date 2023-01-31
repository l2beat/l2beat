import React from 'react'

import { Badge } from '../badge/Badge'

export function NoInfoCell() {
  return (
    <Badge type="gray" title="This item is still under review." oneSize>
      No info
    </Badge>
  )
}
