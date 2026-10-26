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

  it('keeps chains that share a display name apart', () => {
    const a = project('a')
    const groups = groupDeployments([
      { ...deployment('0x1', 'Pepe Unchained', [a]), chainId: 'pepeunchained' },
      {
        ...deployment('0x2', 'Pepe Unchained', [a]),
        chainId: 'pepeunchained2',
      },
    ])

    expect(groups.map((g) => g.chainId)).toEqual([
      'pepeunchained',
      'pepeunchained2',
    ])
  })

  it('puts deployments no project uses last, Ethereum first, then by chain', () => {
    const a = project('a')
    const groups = groupDeployments([
      deployment('0x1', 'Optimism', []),
      deployment('0x2', 'Arbitrum', []),
      deployment('0x3', 'Ethereum', []),
      deployment('0x4', 'Base', [a]),
    ])

    expect(groups.map((g) => g.chain)).toEqual([
      'Base',
      'Ethereum',
      'Arbitrum',
      'Optimism',
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
