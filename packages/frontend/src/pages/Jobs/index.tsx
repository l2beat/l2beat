import React from 'react'

import { getProps } from './getProps'
import { JobsPage } from './JobsPage'

export function getJobsPage() {
  return {
    slug: '/jobs',
    page: <JobsPage {...getProps()} />,
  }
}
