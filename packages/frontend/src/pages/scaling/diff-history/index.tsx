import {  DiffHistoryApiResponse } from '@l2beat/shared-pure'
import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getProps } from './props'
import { DiffHistoryPage } from './view/DiffHistoryPage'

export function getDiffHistoryPages(
  config: Config,
  diffHistory: DiffHistoryApiResponse,
) {
  const included = config.layer2s.filter(
    (layer2) =>
      diffHistory.find((diff) => diff.project === layer2.id.toString()) !==
      undefined,
  )

  return included.map((layer2) => {
    const { wrapper, props } = getProps(layer2, config, diffHistory)

    return {
      slug: `/scaling/projects/${layer2.display.slug}/changelog`,
      page: (
        <PageWrapper {...wrapper}>
          <DiffHistoryPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
