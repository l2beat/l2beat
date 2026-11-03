import type { ProjectScalingStage, StageConfigured } from '@l2beat/config'

/**
 * The stage as a stage cell reads it. The per-requirement `summary` only
 * shows in the project page's stage section, and on /layer2s/summary it was
 * ~50 KB of the page data that the tooltip never rendered.
 */
export type TableStage =
  | Exclude<ProjectScalingStage, StageConfigured>
  | Omit<StageConfigured, 'summary'>

export function toTableStage(stage: ProjectScalingStage): TableStage {
  if (!('summary' in stage)) return stage
  const { summary: _, ...tableStage } = stage
  return tableStage
}
