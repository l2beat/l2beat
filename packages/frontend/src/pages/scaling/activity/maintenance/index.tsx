import React from 'react'
import { PageWrapper } from '../../../../components'
import { Config } from '../../../../build/config'
import { ACTIVITY_PAGE_METADATA } from '../props'
import { ActivityMaintenancePage } from './view/ActivityMaintenancePage'

export function getMaintenanceActivityPage(config: Config) {
  return {
    slug: '/scaling/activity',
    page: (
      <PageWrapper
        metadata={ACTIVITY_PAGE_METADATA}
        banner={config.features.banner}
      >
        <ActivityMaintenancePage />
      </PageWrapper>
    ),
  }
}
