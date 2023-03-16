import React from 'react'

import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'

interface DashboardPageProps {
  projects: string[]
  allProjects: string[]
}

export function DashboardPage(props: DashboardPageProps) {
  const projects = props.projects
    .concat(props.allProjects.filter((p) => !props.projects.includes(p)))
    .sort()
  return (
    <Page title="Discovery">
      <meter
        id="configs-created"
        min={0}
        max={props.allProjects.length}
        low={props.allProjects.length}
        high={props.allProjects.length}
        optimum={props.allProjects.length}
        value={props.projects.length}
      />
      <label style={{ marginLeft: '8px' }} htmlFor="configs-created">
        {props.projects.length}/{props.allProjects.length} configs created
      </label>
      {projects.map((project, index) => (
        <div key={index}>
          {props.projects.includes(project) ? '' : '❌ '}
          {props.projects.includes(project) ? (
            <a href={`/status/discovery/${project}`} key={index}>
              {project}
            </a>
          ) : (
            <span key={index}>{project}</span>
          )}
        </div>
      ))}
    </Page>
  )
}

export function renderDiscoveryDashboard(props: DashboardPageProps) {
  return reactToHtml(<DashboardPage {...props} />)
}
