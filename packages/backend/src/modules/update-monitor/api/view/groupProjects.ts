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
  projectConfigs: Project<never, 'scalingInfo' | 'isDaLayer'>[],
): Group[] {
  const projectMap = new Map(
    projectConfigs.map((c) => [
      c.id.toString(),
      {
        stacks: c.scalingInfo?.stacks ?? [],
        isDaLayer: c.isDaLayer ?? false,
      },
    ]),
  )

  const isStack = (name: string, ...stacks: ProjectScalingStack[]) =>
    projectMap
      .get(name)
      ?.stacks.some((projectStack) => stacks.includes(projectStack)) ?? false

  const getFirstStack = (name: string): ProjectScalingStack | undefined => {
    const stacks = projectMap.get(name)?.stacks
    return stacks && stacks.length > 0 ? stacks[0] : undefined
  }

  type GroupConfig = {
    name: string
    assignees: readonly string[]
    predicate: (p: DashboardProject) => boolean
    variant?: GroupVariant
  }

  const groupConfigs: GroupConfig[] = [
    // Stacks first - use first stack in array
    {
      name: 'OP Stack',
      assignees: ['🐱', '🐿'],
      predicate: (p) => getFirstStack(p.name) === 'OP Stack',
    },
    {
      name: 'Orbit/Arbitrum Stack',
      assignees: ['🐿', '🐱'],
      predicate: (p) => getFirstStack(p.name) === 'Arbitrum Stack',
    },
    {
      name: 'Polygon Stack',
      assignees: ['🐻', '🐝'],
      predicate: (p) =>
        getFirstStack(p.name) === 'Agglayer CDK' ||
        p.name === 'shared-polygon-cdk',
    },
    {
      name: 'ZK Stack',
      assignees: ['🐝', '🐻'],
      predicate: (p) =>
        getFirstStack(p.name) === 'ZK Stack' ||
        p.name === 'gateway' ||
        p.name === 'shared-zk-stack',
    },
    {
      name: 'Starknet & Starkexes',
      assignees: ['🐝', '🐻'],
      predicate: (p) =>
        isStack(p.name, 'StarkEx', 'SN Stack') ||
        p.name === 'shared-sharp-verifier',
    },
    // Then the broader categories
    {
      name: 'DA Projects',
      assignees: ['🐿', '🐱'],
      predicate: (p) =>
        projectMap.get(p.name)?.isDaLayer ||
        p.name === 'blobstream' ||
        p.name === 'vector' ||
        p.name === 'shared-eigenlayer',
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
