import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getProps } from './props/getProps'
import { GlossaryPage } from './view/GlossaryPage'

export function getGlossaryPage(config: Config) {
  const { wrapper, props } = getProps(config)
  return {
    slug: '/glossary',
    page: (
      <PageWrapper {...wrapper}>
        <GlossaryPage {...props} />
      </PageWrapper>
    ),
  }
}
