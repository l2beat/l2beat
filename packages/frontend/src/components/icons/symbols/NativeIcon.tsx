import React from 'react'

import { Square } from '../../Square'

/*  IMPORTANT
  If you change this file you need to update POINT_CLASS_NAMES.pinkSquare in the following file too:
  * packages/frontend/src/scripts/charts/styles.ts
*/

export function NativeIcon() {
  return <Square aria-label="Native asset icon" variant="native" size="small" />
}
