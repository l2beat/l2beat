import React from 'react'

import { Circles as CirclesComponent } from './Circles'

export default {
  title: 'Components/Circles',
}

export function Circles() {
  return (
    <div className="p-10">
      <CirclesComponent summary={[1, 2, 0, 1, 2]} />
    </div>
  )
}
