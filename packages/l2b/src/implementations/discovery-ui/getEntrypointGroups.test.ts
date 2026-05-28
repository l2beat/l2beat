import type { DiscoveryOutput } from '@l2beat/discovery'
import type { Entrypoint } from '@l2beat/discovery/dist/discovery/config/StructureConfig'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getEntrypointGroups } from './getEntrypointGroups'

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
  it('returns groups for external entrypoints with bridge references', () => {
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
        id: 'shared-module',
        label: 'shared-module/entrypoints.json',
        sourceProject: 'shared-module',
        memberAddresses: [bridge, member],
        bridgeAddresses: [bridge],
        contractCount: 1,
        eoaCount: 1,
      },
    ])
  })

  it('skips legacy entrypoints and the current project', () => {
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
