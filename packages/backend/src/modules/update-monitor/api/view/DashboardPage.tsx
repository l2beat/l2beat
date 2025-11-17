import type { Project } from '@l2beat/config'
import { sortBySeverity } from '@l2beat/discovery'
import React, { type ReactNode } from 'react'
import { getQuickAccess } from '../../utils/getQuickAccess'
import type { DashboardProject } from '../props/getDashboardProjects'
import { Diff } from './components/Diff'
import { Page } from './components/Page'
import { reactToHtml } from './components/reactToHtml'
import { type Group, groupProjects } from './groupProjects'

const DASHBOARD_PATH = '/status/discovery'

interface DashboardPageProps {
  groups: Group[]
  projectsWithHighSeverityChanges: Set<string>
  selectedEmoji?: string
}

function DashboardPage({
  groups,
  projectsWithHighSeverityChanges,
  selectedEmoji,
}: DashboardPageProps) {
  const emojiFilters = Array.from(
    new Set(groups.flatMap((group) => group.assignees)),
  )
  const emojiFilterActive =
    selectedEmoji !== undefined && emojiFilters.includes(selectedEmoji)
  const filteredGroups = emojiFilterActive
    ? groups.filter((group) => group.assignees.includes(selectedEmoji))
    : groups

  const renderFilterButton = (label: string, href: string, active: boolean) => (
    <a
      key={label}
      href={href}
      style={{
        border: '1px solid',
        borderColor: active ? '#fef4d0' : '#3a3f4d',
        backgroundColor: active ? '#fef4d0' : 'transparent',
        color: active ? '#0b0f16' : '#fef4d0',
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '18px',
        lineHeight: 1,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '42px',
        boxShadow: active ? '0 0 8px rgba(254, 244, 208, 0.3)' : undefined,
      }}
      aria-current={active ? 'true' : undefined}
    >
      {label}
    </a>
  )

  const filtersPanel =
    emojiFilters.length > 0 ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '12px 16px',
          border: '1px solid #262a35',
          backgroundColor: '#0c1018',
          boxShadow: '4px 4px 0 #040507',
          minWidth: '220px',
        }}
      >
        <span
          style={{
            color: '#c6c2b8',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Filter by emoji
        </span>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {renderFilterButton('All', DASHBOARD_PATH, !emojiFilterActive)}
          {emojiFilters.map((emoji) =>
            renderFilterButton(
              emoji,
              `${DASHBOARD_PATH}?emoji=${encodeURIComponent(emoji)}`,
              emojiFilterActive && selectedEmoji === emoji,
            ),
          )}
        </div>
      </div>
    ) : undefined

  return (
    <Page title="Discovery" headerRight={filtersPanel}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          paddingBottom: '40px',
        }}
      >
        {filteredGroups.length === 0 ? (
          <div
            style={{
              padding: '20px',
              color: '#c6c2b8',
              border: '1px dashed #343944',
              textAlign: 'center',
            }}
          >
            No projects assigned to{' '}
            <span style={{ fontWeight: 600 }}>
              {selectedEmoji ?? 'this filter'}
            </span>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <Group
              key={group.name}
              {...group}
              projectsWithHighSeverityChanges={projectsWithHighSeverityChanges}
            />
          ))
        )}
      </div>
    </Page>
  )
}

function Group({
  name,
  assignees,
  projects,
  variant,
  projectsWithHighSeverityChanges,
}: Group & { projectsWithHighSeverityChanges: Set<string> }) {
  const inlineLabel = variant === 'single' && projects.length === 1
  const header =
    assignees.length > 0 ? `${name} :: ${assignees.join(' ')}` : name

  return (
    <section
      style={{
        border: '2px solid #343944',
        padding: '20px',
        backgroundColor: '#10131a',
        boxShadow: '5px 5px 0 #040507',
        width: '100%',
        color: '#f6f4ee',
      }}
    >
      {!inlineLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            textTransform: 'uppercase',
            fontSize: '16px',
            letterSpacing: '0.08em',
            color: '#c6c2b8',
            borderBottom: '1px solid #232733',
            paddingBottom: '10px',
            marginBottom: '14px',
          }}
        >
          <span>{header}</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {projects.map((project, index) => (
          <ProjectRow
            key={project.name}
            project={project}
            assignees={assignees}
            inlineLabel={inlineLabel}
            isFirst={index === 0}
            hasHSC={projectsWithHighSeverityChanges.has(project.name)}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectRow({
  project,
  assignees,
  inlineLabel,
  isFirst,
  hasHSC,
}: {
  project: DashboardProject
  assignees: readonly string[]
  inlineLabel: boolean
  isFirst: boolean
  hasHSC: boolean
}) {
  const hasChanges = (project.changes.diff?.length ?? 0) > 0
  const statusColors = hasChanges
    ? {
        borderColor: '#ffb155',
        color: '#0a0d13',
        backgroundColor: '#ffb155',
      }
    : {
        borderColor: '#3a3f4d',
        color: '#cfd2d8',
        backgroundColor: '#191d27',
      }

  const statusChip = (
    <span
      style={{
        border: `2px solid ${statusColors.borderColor}`,
        backgroundColor: statusColors.backgroundColor,
        color: statusColors.color,
        fontSize: '11px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '3px 9px',
        flexShrink: 0,
      }}
    >
      {hasChanges ? 'DIFF' : 'QUIET'}
    </span>
  )

  const emojiBadge =
    inlineLabel && assignees.length > 0 ? (
      <span
        style={{
          fontSize: '20px',
          letterSpacing: '10px',
          padding: '2px 14px',
          borderRadius: '999px',
          backgroundColor: '#1c2431',
          color: '#fef4d0',
          boxShadow: '0 0 0 1px #434a5a inset',
        }}
      >
        {assignees.join(' ')}
      </span>
    ) : null

  const summaryContent = (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: inlineLabel ? '20px' : '15px',
              fontWeight: 650,
              letterSpacing: '0.12em',
            }}
          >
            {formatProjectName(project.name)}
          </span>
          {emojiBadge}
        </div>
      </div>
      {hasChanges && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#cdd0d7',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {hasHSC && (
            <span
              style={{
                color: '#ff5a64',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              High severity change <span style={{ fontSize: '14px' }}>🔥</span>
            </span>
          )}
          <span
            style={{
              color: '#fef4d0',
              fontWeight: 600,
            }}
          >
            Click to expand
          </span>
          {statusChip}
        </div>
      )}
    </div>
  )

  const summaryWrapper = (
    <div
      style={{
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box',
        padding: hasChanges ? '8px 10px' : '2px 0px',
        border: hasChanges ? '1px solid #3d2b12' : undefined,
        backgroundColor: hasChanges ? '#1a1309' : 'transparent',
        borderRadius: '4px',
      }}
    >
      {summaryContent}
    </div>
  )

  return (
    <div
      style={{
        paddingTop: isFirst ? '0px' : '6px',
        borderTop: isFirst ? undefined : '1px solid #1c202d',
        paddingRight: '8px',
      }}
    >
      {hasChanges ? (
        <ChangedDetectedDropdown
          project={project}
          trackedTxsAffected={project.changes.trackedTxsAffected}
          summary={summaryWrapper}
          hasHSC={hasHSC}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 0',
            color: '#d7d4cd',
            fontSize: '14px',
            letterSpacing: '0.1em',
          }}
        >
          <span>{formatProjectName(project.name)}</span>
          {emojiBadge}
        </div>
      )}
    </div>
  )
}

function formatProjectName(name: string) {
  return name.replace(/-/g, ' ').toUpperCase()
}

function ChangedDetectedDropdown({
  project,
  summary,
  trackedTxsAffected,
  hasHSC,
}: {
  project: DashboardProject
  summary: ReactNode
  trackedTxsAffected?: boolean
  hasHSC: boolean
}) {
  const hasDiff = (project.changes.diff?.length ?? 0) > 0
  if (!hasDiff) {
    return null
  }

  const severityAccent = hasHSC ? '#ff5a64' : '#ffb155'
  const summaryColor = hasHSC ? '#ffe2e3' : '#f8f7f2'

  return (
    <details
      key={project.name}
      style={{
        margin: 0,
        padding: 0,
        width: '100%',
        borderLeft: `3px solid ${severityAccent}`,
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          color: summaryColor,
          outline: 'none',
          display: 'block',
        }}
      >
        {summary}
      </summary>
      <div
        style={{
          marginTop: '10px',
          borderTop: '1px solid #2e3343',
          paddingTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {trackedTxsAffected && (
          <div
            style={{
              color: '#ffe67a',
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.12em',
            }}
          >
            ⚠️ Tracked transactions might be affected
          </div>
        )}
        {project.changes.diff?.map((d, index) => {
          const quickAccess = getQuickAccess(d)
          const diffKey = `${project.name}-${d.address.toString()}-${index}`

          return (
            <div
              key={diffKey}
              style={{
                border: '1px solid #393f4c',
                padding: '14px',
                backgroundColor: '#141824',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {d.type !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: d.type === 'created' ? '#86ffbd' : '#ff9d94',
                  }}
                >
                  {d.type === 'created' ? '+ CREATED' : '- REMOVED'}
                </span>
              )}
              <span style={{ fontWeight: 600 }}>
                {d.name} · {d.address.toString()}
              </span>
              <span style={{ color: '#d6d3cb' }}>
                description: {d.description ?? 'None'}
              </span>
              {quickAccess.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  {quickAccess.map((x, linkIndex) => (
                    <a
                      key={`${x.name}-${linkIndex}`}
                      href={x.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: 'none',
                        color: '#111319',
                        backgroundColor: '#fef4d0',
                        border: '2px solid #fef4d0',
                        padding: '4px 12px',
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {x.name}
                    </a>
                  ))}
                </div>
              )}
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  color: '#f0ede7',
                }}
              >
                {sortBySeverity(d.diff).map((x, diffIndex) => (
                  <li key={diffIndex} style={{ marginBottom: '6px' }}>
                    <Diff diff={x} />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </details>
  )
}

export function renderDashboardPage(
  projects: DashboardProject[],
  projectConfigs: Project<never, 'scalingInfo' | 'isBridge' | 'isDaLayer'>[],
  projectsWithHighSeverityChanges: Set<string>,
  selectedEmoji?: string,
) {
  const groups = groupProjects(projects, projectConfigs)
  return reactToHtml(
    <DashboardPage
      groups={groups}
      projectsWithHighSeverityChanges={projectsWithHighSeverityChanges}
      selectedEmoji={selectedEmoji}
    />,
  )
}
