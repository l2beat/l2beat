import { sortBySeverity } from '@l2beat/discovery'
import React, { type ReactNode } from 'react'
import type { DashboardProject } from '../props/getDashboardProjects'
import { TableData } from './components/Components'
import { Diff } from './components/Diff'
import { Page } from './components/Page'
import { reactToHtml } from './components/reactToHtml'

interface DashboardPageProps {
  projects: Record<string, DashboardProject[]>
}

function DashboardPage(props: DashboardPageProps) {
  return (
    <Page title="Discovery">
      <table style={{ width: '100%', wordBreak: 'break-word' }}>
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
                        project.changes.diff &&
                        project.changes.diff.length > 0 ? (
                          <ChangedDetectedDropdown
                            project={project}
                            trackedTxsAffected={
                              project.changes.trackedTxsAffected
                            }
                            summary={
                              <div
                                style={{ color: '#cecbc4' }}
                              >{`${project.name} (Changes Detected!)`}</div>
                            }
                          />
                        ) : (
                          <div>{project.name}</div>
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
  trackedTxsAffected,
}: {
  project: DashboardProject
  summary: ReactNode
  trackedTxsAffected?: boolean
}) {
  return (
    project.changes.diff &&
    project.changes.diff.length > 0 && (
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
          {trackedTxsAffected && (
            <span style={{ color: 'yellow' }}>
              Tracked transactions might be affected
            </span>
          )}
          {project.changes.diff.map((d, index) => {
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
