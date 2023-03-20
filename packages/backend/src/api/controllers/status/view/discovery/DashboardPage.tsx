import { default as React, default as React } from 'react'

import { Page } from '../Page'
import { reactToHtml } from '../reactToHtml'
import { DASHBOARD_COLORS } from './types'

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
            <th rowSpan={2}>Project</th>
            <th colSpan={4}>Contracts</th>
            <th rowSpan={2} />
            <th colSpan={4}>Values</th>
          </tr>
          <tr>
            {/* <th>Project</th> */}
            <th>ALL</th>
            <th style={{ color: DASHBOARD_COLORS.INITIAL }}>Initial</th>
            <th style={{ color: DASHBOARD_COLORS.DISCOVERED }}>Discovered</th>
            <th style={{ color: DASHBOARD_COLORS.UNVERIFIED }}>Unverified</th>
            <th style={{ color: DASHBOARD_COLORS.WATCHED }}>Watched</th>
            <th style={{ color: DASHBOARD_COLORS.IGNORED_IN_WATCH_MODE }}>
              IgnoreInWatchmode
            </th>
            <th style={{ color: DASHBOARD_COLORS.IGNORED }}>Ignored</th>
            <th style={{ color: DASHBOARD_COLORS.NOT_HANDLED }}>Not handled</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index} style={{ padding: '0px' }}>
              <td style={{ padding: '1px 2px' }}>
                {project.discoveredCount !== undefined ? '' : '❌ '}
                {project.discoveredCount !== undefined ? (
                  <a href={`/status/discovery/${project.name}`}>
                    {project.name}
                  </a>
                ) : (
                  <span key={index}>{project.name}</span>
                )}
              </td>
              <td style={{ padding: '1px 2px' }}>
                {project.discoveredCount !== undefined &&
                  project.discoveredCount}
              </td>
              <td
                style={{ color: DASHBOARD_COLORS.INITIAL, padding: '1px 2px' }}
              >
                {project.initialAddressesCount !== undefined &&
                  project.initialAddressesCount}
              </td>
              <td
                style={{
                  color: DASHBOARD_COLORS.DISCOVERED,
                  padding: '1px 2px',
                }}
              >
                {project.initialAddressesCount !== undefined &&
                  project.discoveredCount !== undefined &&
                  project.discoveredCount - project.initialAddressesCount}
              </td>
              <td
                style={{
                  color: DASHBOARD_COLORS.UNVERIFIED,
                  padding: '1px 2px',
                }}
              >
                {(project.unverifiedCount ?? 0) > 0 && project.unverifiedCount}
              </td>
              <td style={{ padding: '1px 2px' }} />
              <td
                style={{ color: DASHBOARD_COLORS.WATCHED, padding: '1px 2px' }}
              >
                {project.watchedCount !== undefined && project.watchedCount}
              </td>
              <td
                style={{
                  color: DASHBOARD_COLORS.IGNORED_IN_WATCH_MODE,
                  padding: '1px 2px',
                }}
              >
                {project.ignoredInWatchModeCount !== undefined &&
                  project.ignoredInWatchModeCount}
              </td>
              <td
                style={{ color: DASHBOARD_COLORS.IGNORED, padding: '1px 2px' }}
              >
                {project.ignoredCount !== undefined && project.ignoredCount}
              </td>
              <td
                style={{
                  color: DASHBOARD_COLORS.NOT_HANDLED,
                  padding: '1px 2px',
                }}
              >
                {project.notHandledCount !== undefined &&
                  project.notHandledCount}
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
