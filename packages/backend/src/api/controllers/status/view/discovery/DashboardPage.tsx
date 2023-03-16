import React from 'react'

import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'

interface DashboardPageProps {
  projects: string[]
}

export function DashboardPage(props: DashboardPageProps) {
  return (
    <Page title="Discovery">
      {props.projects.map((project, index) => (
        <div>
          <a href={`/status/discovery/${project}`} key={index}>
            {project}
          </a>
        </div>
      ))}
    </Page>
  )
}

export function renderDiscoveryDashboard(props: DashboardPageProps) {
  return reactToHtml(<DashboardPage {...props} />)
}
