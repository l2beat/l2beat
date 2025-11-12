import type { Project, ProjectScalingStack } from '@l2beat/config'
import partition from 'lodash/partition'
import type { DashboardProject } from '../props/getDashboardProjects'

// NOTE(radomski): For brevity so we can have all logic on a single line per group
type DP = DashboardProject

export interface Group {
  name: string
  assignees: readonly string[]
  projects: DashboardProject[]
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

  const groupConfigs = [
    ['Scroll', ['🐿', '🐱'], (p: DP) => p.name === 'scroll'],
    ['Taiko', ['🐻', '🐱'], (p: DP) => p.name === 'taiko'],
    ['Linea', ['🐝', '🐱'], (p: DP) => p.name === 'linea'],
    ['OP Stack', ['🐿', '🐱'], (p: DP) => isStack(p.name, 'OP Stack')],
    [
      'Orbit/Arbitrum Stack',
      ['🐿', '🐱'],
      (p: DP) => isStack(p.name, 'Arbitrum'),
    ],
    ['Polygon Stack', ['🐿', '🐻'], (p: DP) => isStack(p.name, 'Agglayer CDK')],
    ['ZK Stack', ['🐝', '🐻'], (p: DP) => isStack(p.name, 'ZK Stack')],
    [
      'Starknet & Starkexes',
      ['🐝', '🐻'],
      (p: DP) => isStack(p.name, 'StarkEx', 'SN Stack'),
    ],
    ['DA Projects', ['🐿', '🐱'], (p: DP) => projectMap.get(p.name)?.isDaLayer],
    [
      'Bridge Projects',
      ['🐿', '🐻'],
      (p: DP) => projectMap.get(p.name)?.isBridge,
    ],
  ] as const

  let remaining = projects
  const result: Group[] = []

  for (const [key, assignees, pred] of groupConfigs) {
    const [group, rest] = partition(remaining, pred)
    if (group.length) result.push({ name: key, assignees, projects: group })
    remaining = rest
  }

  result.push({ name: 'Other', assignees: [], projects: remaining })

  return result
}
