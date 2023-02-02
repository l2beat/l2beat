import React from 'react'

import { TechnologyIncomplete as TechnologyIncompleteComponent } from './TechnologyIncomplete'

export default {
  title: 'Components/Project/TechnologyIncomplete',
}

export function TechnologyIncomplete() {
  return (
    <div className="p-4 leading-normal">
      <TechnologyIncompleteComponent editLink="#" twitterLink="#" />
    </div>
  )
}
