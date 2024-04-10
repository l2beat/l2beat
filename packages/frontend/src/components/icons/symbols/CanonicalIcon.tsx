import React from 'react'

import { Square } from '../../Square'

/*  IMPORTANT
  If you change this file you need to update POINT_CLASS_NAMES.purpleCircle in the following file too:
  * packages/frontend/src/scripts/charts/styles.ts
*/

export function CanonicalIcon() {
  return (
    <Square aria-label="Bridged asset icon" variant="canonical" size="small" />
  )
}
