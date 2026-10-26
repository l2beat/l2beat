import type { ProjectPrivacyInfo, ProjectScalingInfo } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { DashboardProject } from '../props/getDashboardProjects'
import { type GroupingProjectConfig, groupProjects } from './groupProjects'

describe(groupProjects.name, () => {
  it('groups defi and privacy projects with their assignees', () => {
    const projects = ['optimism', 'uniswapv3', 'railgun', 'unrelated'].map(
      project,
    )
    const configs = [
      config('optimism', {
        scalingInfo: mockObject<ProjectScalingInfo>({ stacks: ['OP Stack'] }),
      }),
      config('uniswapv3', { defiInfo: { category: 'DEX' } }),
      config('railgun', { privacyInfo: mockObject<ProjectPrivacyInfo>() }),
    ]

    const groups = groupProjects(projects, configs)

    expect(
      groups.map((g) => [g.name, g.assignees, g.projects.map((p) => p.name)]),
    ).toEqual([
      ['OP Stack', ['🐱', '🐿'], ['optimism']],
      ['DeFi', ['🐱', '🐿'], ['uniswapv3']],
      ['Privacy', ['🐝', '🐻'], ['railgun']],
      ['Other', [], ['unrelated']],
    ])
  })

  it('groups external interop protocols but not canonical bridges', () => {
    const projects = ['base', 'basesolbridge', 'layerzero', 'wormhole'].map(
      project,
    )
    const configs = [
      config('base', {
        scalingInfo: mockObject<ProjectScalingInfo>({ stacks: ['OP Stack'] }),
        interopConfig: { type: 'canonical', plugins: [] },
      }),
      config('basesolbridge', {
        interopConfig: { type: 'canonical', plugins: [] },
      }),
      config('layerzero', {
        interopConfig: { type: 'multichain', plugins: [] },
      }),
    ]

    const groups = groupProjects(projects, configs)

    expect(
      groups.map((g) => [g.name, g.assignees, g.projects.map((p) => p.name)]),
    ).toEqual([
      ['OP Stack', ['🐱', '🐿'], ['base']],
      ['Interop', ['🐱', '🐿'], ['layerzero', 'wormhole']],
      ['Other', [], ['basesolbridge']],
    ])
  })
})

function project(name: string): DashboardProject {
  return { name, changes: {} }
}

function config(
  id: string,
  overrides: Partial<GroupingProjectConfig> = {},
): GroupingProjectConfig {
  return {
    id: ProjectId(id),
    scalingInfo: undefined,
    daLayer: undefined,
    privacyInfo: undefined,
    defiInfo: undefined,
    interopConfig: undefined,
    ...overrides,
  } as GroupingProjectConfig
}
