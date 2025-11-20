import type { Project, ProjectScalingStack } from '@l2beat/config'
import partition from 'lodash/partition'
import type { DashboardProject } from '../props/getDashboardProjects'

export type GroupVariant = 'single'

export interface Group {
  name: string
  assignees: readonly string[]
  projects: DashboardProject[]
  variant?: GroupVariant
}

export function groupProjects(
  projects: DashboardProject[],
  projectConfigs: Project<never, 'scalingInfo' | 'isBridge' | 'isDaLayer'>[],
): Group[] {
  const projectMap = new Map(
    projectConfigs.map((c) => [
      c.id.toString(),
      {
        stacks: c.scalingInfo?.stacks ?? [],
        isBridge: c.isBridge ?? false,
        isDaLayer: c.isDaLayer ?? false,
      },
    ]),
  )

  const isStack = (name: string, ...stacks: ProjectScalingStack[]) =>
    projectMap
      .get(name)
      ?.stacks.some((projectStack) => stacks.includes(projectStack)) ?? false

  type GroupConfig = {
    name: string
    assignees: readonly string[]
    predicate: (p: DashboardProject) => boolean
    variant?: GroupVariant
  }

  const groupConfigs: GroupConfig[] = [
    // Stacks first
    {
      name: 'OP Stack',
      assignees: ['🐱', '🐿'],
      predicate: (p) => isStack(p.name, 'OP Stack'),
    },
    {
      name: 'Orbit/Arbitrum Stack',
      assignees: ['🐿', '🐱'],
      predicate: (p) => isStack(p.name, 'Arbitrum'),
    },
    {
      name: 'Polygon Stack',
      assignees: ['🐻', '🐝'],
      predicate: (p) => isStack(p.name, 'Agglayer CDK'),
    },
    {
      name: 'ZK Stack',
      assignees: ['🐝', '🐻'],
      predicate: (p) => isStack(p.name, 'ZK Stack') || p.name === 'gateway',
    },
    {
      name: 'Starknet & Starkexes',
      assignees: ['🐝', '🐻'],
      predicate: (p) => isStack(p.name, 'StarkEx', 'SN Stack'),
    },
    // Then the broader categories
    {
      name: 'DA Projects',
      assignees: ['🐿', '🐱'],
      predicate: (p) =>
        projectMap.get(p.name)?.isDaLayer ||
        p.name === 'blobstream' ||
        p.name === 'vector',
    },
    {
      name: 'Bridge Projects',
      assignees: ['🐻', '🐿'],
      predicate: (p) => projectMap.get(p.name)?.isBridge ?? false,
    },
    // Finally individual projects so they can show inline labels
    {
      name: 'Scroll',
      assignees: ['🐿', '🐱'],
      predicate: (p) => p.name === 'scroll',
      variant: 'single',
    },
    {
      name: 'Taiko',
      assignees: ['🐻', '🐱'],
      predicate: (p) => p.name === 'taiko',
      variant: 'single',
    },
    {
      name: 'Linea',
      assignees: ['🐱', '🐝'],
      predicate: (p) => p.name === 'linea',
      variant: 'single',
    },
  ]

  let remaining = projects
  const result: Group[] = []

  for (const { name, assignees, predicate, variant } of groupConfigs) {
    const [group, rest] = partition(remaining, predicate)
    if (group.length) result.push({ name, assignees, projects: group, variant })
    remaining = rest
  }

  result.push({ name: 'Other', assignees: [], projects: remaining })

  return result
}
