import React from 'react'

import { ScalingTableFilters as ScalingTableFiltersComponent } from './ScalingTableFilters'

export default {
  title: 'Components/Table/ScalingFilters',
}

export function ScalingFilters() {
  return (
    <div className="p-10">
      <ScalingTableFiltersComponent />
    </div>
  )
}
