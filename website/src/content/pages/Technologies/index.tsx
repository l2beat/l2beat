import React from 'react'
import { getTechnologiesPageProps } from './getTechnologiesPageProps'
import { TechnologiesPage } from './TechnologiesPage'

export function Technologies() {
  return <TechnologiesPage {...getTechnologiesPageProps()} />
}
