import React from 'react'

import { Square } from '../../Square'

/*  IMPORTANT
  If you change this file you need to update POINT_CLASS_NAMES.yellowTriangle in the following file too:
  * packages/frontend/src/scripts/charts/styles.ts
*/

export function ExternalIcon() {
  return (
    <Square aria-label="External asset icon" variant="external" size="small" />
  )
}
