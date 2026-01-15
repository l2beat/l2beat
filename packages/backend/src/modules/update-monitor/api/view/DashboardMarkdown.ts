import type { Project } from '@l2beat/config'
import { discoveryDiffToMarkdown } from '@l2beat/discovery'
import type { DashboardProject } from '../props/getDashboardProjects'
import { groupProjects } from './groupProjects'

export function renderProjectMarkdown(
  project: DashboardProject,
  hasHighSeverity: boolean,
): string {
  const lines: string[] = []

  // H1: Project name (required)
  lines.push(`# ${project.name}`)
  lines.push('')

  // Blockquote: Short summary
  const hasChanges = (project.changes.diff?.length ?? 0) > 0
  const statusSummary = hasHighSeverity
    ? 'High severity changes detected'
    : hasChanges
      ? 'Changes detected'
      : 'No changes detected'
  lines.push(`> ${statusSummary} in ${project.name} project discovery.`)
  lines.push('')

  // General information
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push(`- **Status**: ${hasChanges ? 'Changes detected' : 'No changes'}`)
  lines.push(`- **High severity**: ${hasHighSeverity ? 'Yes' : 'No'}`)
  lines.push(
    `- **Tracked txs affected**: ${project.changes.trackedTxsAffected ? 'Yes' : 'No'}`,
  )
  lines.push('')

  // H2: Changes
  if (hasChanges) {
    lines.push('## Changes')
    lines.push('')
    lines.push(discoveryDiffToMarkdown(project.changes.diff ?? []))
    lines.push('')
  }

  // H2: Related links
  lines.push('## Related')
  lines.push('')
  lines.push(
    '- [Discovery Dashboard](/status/discovery): Overview of all monitored projects',
  )
  lines.push(
    '- [LLM Overview](/status/discovery/llms.txt): Machine-readable project index',
  )
  lines.push('')

  return lines.join('\n')
}

export function renderDashboardMarkdown(
  projects: DashboardProject[],
  projectConfigs: Project<never, 'scalingInfo' | 'isBridge' | 'isDaLayer'>[],
  projectsWithHighSeverityChanges: Set<string>,
  selectedEmoji?: string,
): string {
  const groups = groupProjects(projects, projectConfigs)
  const emojiFilters = Array.from(
    new Set(groups.flatMap((group) => group.assignees)),
  )
  const emojiFilterActive =
    selectedEmoji !== undefined && emojiFilters.includes(selectedEmoji)
  const filteredGroups = emojiFilterActive
    ? groups.filter((group) => group.assignees.includes(selectedEmoji))
    : groups

  const allProjects = filteredGroups.flatMap((g) => g.projects)
  const projectsWithChanges = allProjects.filter(
    (p) => (p.changes.diff?.length ?? 0) > 0,
  )
  const highSeverityProjects = allProjects.filter((p) =>
    projectsWithHighSeverityChanges.has(p.name),
  )
  const quietProjects = allProjects.filter(
    (p) => (p.changes.diff?.length ?? 0) === 0,
  )

  const lines: string[] = []

  // H1: Project name (required)
  lines.push('# L2BEAT Discovery Dashboard')
  lines.push('')

  // Blockquote: Short summary
  lines.push(
    '> Real-time monitoring of smart contract changes across Layer 2 projects tracked by L2BEAT discovery system.',
  )
  lines.push('')

  // General information (no headings)
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push(
    `Monitoring ${allProjects.length} projects across ${filteredGroups.length} groups.`,
  )
  if (emojiFilterActive) {
    lines.push(`Filtered by assignee: ${selectedEmoji}`)
  }
  lines.push('')

  // H2: High Severity Changes (most important first)
  if (highSeverityProjects.length > 0) {
    lines.push('## High Severity Changes')
    lines.push('')
    for (const project of highSeverityProjects) {
      const diff = project.changes.diff ?? []
      const diffSummary =
        diff.length > 0 ? `${diff.length} change(s) detected` : 'Flagged'
      lines.push(
        `- [${project.name}](/status/discovery/${project.name}.html.md): ${diffSummary}`,
      )
    }
    lines.push('')
  }

  // H2: Projects with Changes
  const nonHighSeverityChanges = projectsWithChanges.filter(
    (p) => !projectsWithHighSeverityChanges.has(p.name),
  )
  if (nonHighSeverityChanges.length > 0) {
    lines.push('## Projects with Changes')
    lines.push('')
    for (const project of nonHighSeverityChanges) {
      const diff = project.changes.diff ?? []
      const trackedTxsNote = project.changes.trackedTxsAffected
        ? ', tracked txs affected'
        : ''
      lines.push(
        `- [${project.name}](/status/discovery/${project.name}.html.md): ${diff.length} change(s)${trackedTxsNote}`,
      )
    }
    lines.push('')
  }

  // H2: Optional section - quiet projects (can be skipped for shorter context)
  if (quietProjects.length > 0) {
    lines.push('## Optional')
    lines.push('')
    for (const project of quietProjects) {
      lines.push(
        `- [${project.name}](/status/discovery/${project.name}.html.md): No changes detected`,
      )
    }
    lines.push('')
  }

  return lines.join('\n')
}
