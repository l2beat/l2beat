import React from 'react'

import { cn } from '../../utils/cn'

export function TechnologyIncompleteShort() {
  return (
    <div
      className={cn(
        'my-2 rounded-lg px-2 py-1 text-xs md:text-base',
        'bg-blue-450/20 text-blue-700 dark:text-blue-300',
      )}
    >
      <strong>Note:</strong> This section requires more research and might not
      present accurate information.
    </div>
  )
}
