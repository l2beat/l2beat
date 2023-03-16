import React from 'react'

import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'

interface DashboardPageProps {
  projects: string[]
  allProjectsCount: number
}

export function DashboardPage(props: DashboardPageProps) {
  return (
    <Page title="Discovery">
      <meter
        id="configs-created"
        min={0}
        max={props.allProjectsCount}
        low={props.allProjectsCount}
        high={props.allProjectsCount}
        optimum={props.allProjectsCount}
        value={props.projects.length}
      />
      <label style={{ marginLeft: '8px' }} htmlFor="configs-created">
        {props.projects.length}/{props.allProjectsCount} configs created
      </label>
      {props.projects.map((project, index) => (
        <div key={index}>
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
