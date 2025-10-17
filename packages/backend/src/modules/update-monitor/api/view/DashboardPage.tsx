import { sortBySeverity } from '@l2beat/discovery'
import React, { type ReactNode } from 'react'
import { getQuickAccess } from '../../utils/getQuickAccess'
import type { DashboardProject } from '../props/getDashboardProjects'
import { TableData } from './components/Components'
import { Diff } from './components/Diff'
import { Page } from './components/Page'
import { reactToHtml } from './components/reactToHtml'

interface DashboardPageProps {
  projects: DashboardProject[]
}

function DashboardPage(props: DashboardPageProps) {
  return (
    <Page title="Discovery">
      <table style={{ width: '100%', wordBreak: 'break-word' }}>
        <tbody>
          <>
            {props.projects.map((project, index) => (
              <tr
                key={index}
                style={{ padding: '0px', textAlign: 'left', width: '100%' }}
              >
                <TableData
                  value={
                    project.changes.diff && project.changes.diff.length > 0 ? (
                      <ChangedDetectedDropdown
                        project={project}
                        trackedTxsAffected={project.changes.trackedTxsAffected}
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
            ))}
          </>
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
            const quickAccess = getQuickAccess(d)
            return (
              <p style={{ marginTop: '8px' }} key={index}>
                {d.type !== undefined && (
                  <>
                    <span
                      style={{
                        background:
                          d.type === 'created' ? '#033a16' : '#67060c',
                        color: d.type === 'created' ? '#87e29a' : '#d1b9b3',
                      }}
                    >
                      {d.type === 'created' ? '+' : '-'} Status:{' '}
                      {d.type.toUpperCase()}
                    </span>
                    <br />
                  </>
                )}
                <span style={{ fontWeight: 'bold' }}>
                  {d.name} - {d.address.toString()}
                </span>
                <br />
                <span>{`+++ description: ${d.description ?? 'None'}`}</span>
                {quickAccess.length > 0 && (
                  <div style={{ marginTop: '12px', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#a0a0a0',
                        marginBottom: '6px',
                        display: 'block',
                      }}
                    >
                      Quick Access:
                    </span>
                    {quickAccess.map((x, index2) => {
                      return (
                        <button
                          key={index2}
                          style={{
                            marginLeft: '12px',
                            marginRight: '6px',
                            marginBottom: '4px',
                            padding: '6px 12px',
                            background: '#1a4d8f',
                            border: '1px solid #2d6ab4',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                        >
                          <a
                            href={x.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontWeight: '500',
                              fontSize: '14px',
                            }}
                          >
                            {x.name}
                          </a>
                        </button>
                      )
                    })}
                    <hr />
                  </div>
                )}
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
