import React from 'react'

import { TechnologyIncomplete as TechnologyIncompleteComponent } from './TechnologyIncomplete'

export default {
  title: 'Components/Project/TechnologyIncomplete',
}

export function TechnologyIncomplete() {
  return (
    <div className="leading-normal p-4">
      <TechnologyIncompleteComponent editLink="#" twitterLink="#" />
    </div>
  )
}
