import React, { type ReactNode } from 'react'

import type { DashboardProject } from '../props/getDashboardProjects'
import { TableData } from './components/Components'
import { Diff } from './components/Diff'
import { Page } from './components/Page'
import { reactToHtml } from './components/reactToHtml'

import { sortBySeverity } from '@l2beat/discovery'

interface DashboardPageProps {
  projects: Record<string, DashboardProject[]>
}

function DashboardPage(props: DashboardPageProps) {
  return (
    <Page title="Discovery">
      <table style={{ width: '100%' }}>
        <tbody>
          {Object.entries(props.projects).map(([chainName, projects]) => (
            <>
              <tr
                key={chainName}
                style={{
                  padding: '0px',
                  width: '1200px',
                  textAlign: 'left',
                  background: '#363636',
                }}
              >
                <th
                  colSpan={12}
                  scope="colgroup"
                  style={{ padding: '0px', textAlign: 'left', width: '1200px' }}
                >
                  {`Chain ${chainName}`}
                </th>
              </tr>
              {projects.map((project, index) => (
                <>
                  <tr
                    key={index}
                    style={{ padding: '0px', textAlign: 'left', width: '100%' }}
                  >
                    <TableData
                      value={
                        project.configured ? (
                          project.diff && project.diff.length > 0 ? (
                            <ChangedDetectedDropdown
                              project={project}
                              summary={
                                <a
                                  href={`/status/discovery/${chainName}/${project.name}`}
                                >
                                  {`${project.name} (Changes Detected!)`}
                                </a>
                              }
                            />
                          ) : (
                            <a
                              href={`/status/discovery/${chainName}/${project.name}`}
                            >
                              {project.name}
                            </a>
                          )
                        ) : (
                          project.name
                        )
                      }
                    />
                  </tr>
                </>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </Page>
  )
}

function ChangedDetectedDropdown({
  project,
  summary,
}: { project: DashboardProject; summary: ReactNode }) {
  return (
    project.diff &&
    project.diff.length > 0 && (
      <details
        key={project.name}
        style={{ marginTop: '0px', marginBottom: '0px', textWrap: 'wrap' }}
      >
        <summary
          style={{ color: 'yellow', fontWeight: 'bold', fontSize: '16px' }}
        >
          {summary}
        </summary>
        <p>
          {project.diff.map((d, index) => {
            return (
              <p style={{ marginTop: '8px' }} key={index}>
                <span style={{ fontWeight: 'bold' }}>
                  {d.name} - {d.address.toString()}
                </span>
                <br />
                <span>{`+++ description: ${d.description ?? 'None'}`}</span>
                <ul>
                  {sortBySeverity(d.diff).map((x, index2) => {
                    return (
                      <li key={index2} style={{ marginLeft: '12px' }}>
                        <Diff diff={x} />
                      </li>
                    )
                  })}
                </ul>
              </p>
            )
          })}
        </p>
      </details>
    )
  )
}

export function renderDashboardPage(props: DashboardPageProps) {
  return reactToHtml(<DashboardPage {...props} />)
}
