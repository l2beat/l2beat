import React from 'react'

import { StageCell } from './StageCell'

export default {
  title: 'Components/Stages',
}

//TODO: add other variants
export function Cell() {
  return (
    <div className="m-4 ml-32">
      <StageCell />
    </div>
  )
}
