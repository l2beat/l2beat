import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'

export function RiskHeader() {
  return (
    <header className="mt-4 md:mt-12">
      <h1 className="font-bold text-3xl mb-1">Risk Analysis</h1>
      <HorizontalSeparator className="md:hidden mt-2" />
    </header>
  )
}
