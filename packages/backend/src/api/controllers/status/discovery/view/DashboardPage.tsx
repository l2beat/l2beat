import React from 'react'

import { Page } from '../../view/Page'
import { reactToHtml } from '../../view/reactToHtml'
import { DashboardProject } from '../props/getDashboardProjects'
import { getHardcoded } from '../props/utils/getHardcoded'
import { DASHBOARD_COLORS } from './constants'

interface DashboardPageProps {
  projects: DashboardProject[]
  projectsList: string[]
}

export function DashboardPage(props: DashboardPageProps) {
  const hardcoded = getHardcoded()

  const projects = props.projects
    .concat(
      props.projectsList
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
        max={props.projectsList.length}
        low={props.projectsList.length}
        high={props.projectsList.length}
        optimum={props.projectsList.length}
        value={props.projects.length}
      />
      <label style={{ marginLeft: '8px' }} htmlFor="configs-created">
        {props.projects.length}/{props.projectsList.length} configs created
      </label>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Project</th>
            <th rowSpan={2}>Hardcoded</th>
            <th colSpan={4}>Contracts</th>
            <th rowSpan={2} />
            <th colSpan={4}>Values</th>
          </tr>
          <tr>
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
              <TableData
                value={
                  hardcoded[project.name] === 0 ? '✅' : hardcoded[project.name]
                }
                color={DASHBOARD_COLORS.UNVERIFIED}
              />
              <TableData value={project.discoveredCount} />
              <TableData
                value={project.initialAddressesCount}
                color={DASHBOARD_COLORS.INITIAL}
              />
              <TableData
                value={
                  project.discoveredCount && project.initialAddressesCount
                    ? project.discoveredCount - project.initialAddressesCount
                    : undefined
                }
                color={DASHBOARD_COLORS.DISCOVERED}
              />
              <TableData
                value={project.unverifiedCount}
                color={DASHBOARD_COLORS.UNVERIFIED}
              />
              <TableData />
              <TableData
                value={project.watchedCount}
                color={DASHBOARD_COLORS.WATCHED}
              />
              <TableData
                value={project.ignoredInWatchModeCount}
                color={DASHBOARD_COLORS.IGNORED_IN_WATCH_MODE}
              />
              <TableData
                value={project.ignoredCount}
                color={DASHBOARD_COLORS.IGNORED}
              />
              <TableData
                value={project.notHandledCount}
                color={DASHBOARD_COLORS.NOT_HANDLED}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}

function TableData(props: { value?: number | string; color?: string }) {
  return (
    <td style={{ padding: '1px 2px', color: props.color ?? '' }}>
      {props.value !== undefined && props.value}
    </td>
  )
}

export function renderDashboardPage(props: DashboardPageProps) {
  return reactToHtml(<DashboardPage {...props} />)
}
