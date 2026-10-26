import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { groupDeployments } from './KnownDeployments'

describe(groupDeployments.name, () => {
  it('groups deployments by chain and the set of projects using them', () => {
    const a = project('a')
    const b = project('b')
    const groups = groupDeployments([
      deployment('0x1', 'Ethereum', [a, b]),
      deployment('0x2', 'Arbitrum', [a]),
      deployment('0x3', 'Ethereum', [b, a]),
      // The same address on another chain is a separate deployment.
      deployment('0x1', 'Arbitrum', [a]),
      deployment('0x4', 'Ethereum', []),
    ])

    expect(
      groups.map((g) => [g.chain, g.deployments.map((d) => d.address)]),
    ).toEqual([
      ['Ethereum', ['0x1', '0x3']],
      ['Arbitrum', ['0x2', '0x1']],
      ['Ethereum', ['0x4']],
    ])
  })

  it('puts deployments no project uses last', () => {
    const a = project('a')
    const groups = groupDeployments([
      deployment('0x1', 'Ethereum', []),
      deployment('0x2', 'Arbitrum', []),
      deployment('0x3', 'Ethereum', [a]),
    ])

    expect(groups.map((g) => g.deployments.map((d) => d.address))).toEqual([
      ['0x3'],
      ['0x1'],
      ['0x2'],
    ])
  })
})

function project(id: string) {
  return {
    id: ProjectId(id),
    name: id,
    slug: id,
    icon: '',
    url: undefined,
  }
}

function deployment(
  address: string,
  chain: string,
  projectsUsedIn: ReturnType<typeof project>[],
) {
  return {
    address,
    chainId: chain.toLowerCase(),
    chain,
    chainIcon: '',
    projectsUsedIn,
  }
}
