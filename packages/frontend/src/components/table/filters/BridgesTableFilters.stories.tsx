import React from 'react'

import { BridgesTableFilters as BridgesTableFiltersComponent } from './BridgesTableFilters'

export default {
  title: 'Components/Table/BridgesFilters',
}

export function BridgesFilters() {
  return (
    <div className="p-10">
      <BridgesTableFiltersComponent />
    </div>
  )
}
