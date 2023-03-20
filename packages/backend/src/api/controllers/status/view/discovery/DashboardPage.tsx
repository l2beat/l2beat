import React from 'react'

import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'

interface Project {
  name: string
  discoveredCount?: number
  initialAddressesCount?: number
}

interface DashboardPageProps {
  projects: Project[]
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
