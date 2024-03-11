import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'

export function FinalityHeader() {
  return (
    <header className="mt-4 md:mt-12">
      <h1 className="mb-1 text-3xl font-bold">Finality of Rollups</h1>
      <HorizontalSeparator className="mt-2 md:hidden" />
    </header>
  )
}
