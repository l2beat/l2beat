import type { DiscoveryOutput } from '@l2beat/discovery'
import type { Entrypoint } from '@l2beat/discovery/dist/discovery/config/StructureConfig'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { entrypointGroupId, getEntrypointGroups } from './getEntrypointGroups'

const addr = (n: string) => ChainSpecificAddress.from('eth', n)

function discovery(
  name: string,
  entries: DiscoveryOutput['entries'],
): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    configHash: Hash256.ZERO,
    entries,
    abis: {},
    usedBlockNumbers: {},
    usedTemplates: {},
  }
}

describe(getEntrypointGroups.name, () => {
  it('returns one group per declared entrypoint with bridge references', () => {
    const bridge = addr('0x0000000000000000000000000000000000000001')
    const member = addr('0x0000000000000000000000000000000000000002')
    const entrypoints: Record<ChainSpecificAddress, Entrypoint> = {
      [bridge]: {
        type: 'Contract',
        project: 'shared-module',
        name: 'Bridge',
      },
      [member]: {
        type: 'EOA',
        project: 'shared-module',
      },
    }

    const base = discovery('apex', [
      {
        type: 'Reference',
        address: bridge,
        targetProject: 'shared-module',
        targetType: 'Contract',
      },
    ])
    const shared = discovery('shared-module', [
      { type: 'Contract', address: bridge, name: 'Bridge' },
      { type: 'EOA', address: member },
    ])

    const groups = getEntrypointGroups('apex', entrypoints, base, [base, shared])

    expect(groups).toEqual([
      {
        id: entrypointGroupId('shared-module', bridge),
        label: 'shared-module: Bridge',
        sourceProject: 'shared-module',
        memberAddresses: [bridge],
        bridgeAddresses: [bridge],
        contractCount: 1,
        eoaCount: 0,
      },
      {
        id: entrypointGroupId('shared-module', member),
        label: 'shared-module/entrypoints.json',
        sourceProject: 'shared-module',
        memberAddresses: [member],
        bridgeAddresses: [bridge],
        contractCount: 0,
        eoaCount: 1,
      },
    ])
  })

  it('includes entrypoints declared for the open project', () => {
    const entry = addr('0x0000000000000000000000000000000000000002')
    const entrypoints: Record<ChainSpecificAddress, Entrypoint> = {
      [entry]: {
        type: 'Contract',
        project: 'apex',
        name: 'HomeEntry',
      },
    }
    const base = discovery('apex', [
      { type: 'Contract', address: entry, name: 'HomeEntry' },
    ])

    expect(getEntrypointGroups('apex', entrypoints, base, [base])).toEqual([
      {
        id: entrypointGroupId('apex', entry),
        label: 'apex: HomeEntry',
        sourceProject: 'apex',
        memberAddresses: [entry],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
      },
    ])
  })

  it('lists declared entrypoints even when not present in loaded discoveries', () => {
    const entry = addr('0x0000000000000000000000000000000000000002')
    const entrypoints: Record<ChainSpecificAddress, Entrypoint> = {
      [entry]: {
        type: 'Contract',
        project: 'mode',
        name: 'DeputyPauseModule',
      },
    }
    const base = discovery('celo', [])

    expect(getEntrypointGroups('celo', entrypoints, base, [base])).toEqual([
      {
        id: entrypointGroupId('mode', entry),
        label: 'mode: DeputyPauseModule',
        sourceProject: 'mode',
        memberAddresses: [entry],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
      },
    ])
  })

  it('skips legacy entrypoints', () => {
    const member = addr('0x0000000000000000000000000000000000000002')
    const entrypoints: Record<ChainSpecificAddress, Entrypoint> = {
      [member]: {
        type: 'Contract',
        project: 'apex',
        isLegacy: true,
      },
    }
    const base = discovery('apex', [])

    expect(getEntrypointGroups('apex', entrypoints, base, [base])).toEqual([])
  })
})
