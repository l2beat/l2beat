import React from 'react'

import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'

export interface DashboardProject {
  name: string
  discoveredCount?: number
  initialAddressesCount?: number
  watchedCount?: number
  ignoredInWatchModeCount?: number
  ignoredCount?: number
  notHandledCount?: number
  unverifiedCount?: number
}

interface DashboardPageProps {
  projects: DashboardProject[]
  allProjects: string[]
}

export function DashboardPage(props: DashboardPageProps) {
  const projects = props.projects
    .concat(
      props.allProjects
        .filter(
          (project) => !props.projects.map((x) => x.name).includes(project),
        )
        .map((p) => ({ name: p })),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

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
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Discovered</th>
            <th>Initial</th>
            <th>Watched</th>
            <th>IgnoreInWatchmode</th>
            <th>Ignored</th>
            <th>Not handled</th>
            <th>Unverified</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>
                {project.discoveredCount !== undefined ? '' : '❌ '}
                {project.discoveredCount !== undefined ? (
                  <a href={`/status/discovery/${project.name}`}>
                    {project.name}
                  </a>
                ) : (
                  <span key={index}>{project.name}</span>
                )}
              </td>
              <td>
                {project.discoveredCount !== undefined &&
                  project.discoveredCount}
              </td>
              <td>
                {project.initialAddressesCount !== undefined &&
                  project.initialAddressesCount}
              </td>
              <td>
                {project.watchedCount !== undefined && project.watchedCount}
              </td>
              <td>
                {project.ignoredInWatchModeCount !== undefined &&
                  project.ignoredInWatchModeCount}
              </td>
              <td>
                {project.ignoredCount !== undefined && project.ignoredCount}
              </td>
              <td>
                {project.notHandledCount !== undefined &&
                  project.notHandledCount}
              </td>
              <td>
                {(project.unverifiedCount ?? 0) > 0 && project.unverifiedCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}

export function renderDiscoveryDashboard(props: DashboardPageProps) {
  return reactToHtml(<DashboardPage {...props} />)
}
