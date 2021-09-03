import React from 'react'

import { Header, Page } from '../../common'
import { TechnologiesPageProps } from './getTechnologiesPageProps'

export function TechnologiesPage(props: TechnologiesPageProps) {
  return (
    <Page metadata={props.metadata}>
      <Header title={props.title} />
    </Page>
  )
}
