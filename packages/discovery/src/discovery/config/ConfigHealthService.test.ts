import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'

import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { ConfigHealthService } from './ConfigHealthService'
import { ConfigRegistry } from './ConfigRegistry'
import { StructureContract } from './StructureConfig'

const ADDRESS = ChainSpecificAddress.random()
const TEMPLATE_ID = 'NestedTemplate'

const CONFIG = new ConfigRegistry({
  name: 'nested-health',
  chain: 'ethereum',
  initialAddresses: [ADDRESS],
})

describe(ConfigHealthService.name, () => {
  it('accepts nested value paths in config health', () => {
    const discovery = makeDiscovery({
      name: 'Nested',
      ignoreInWatchMode: ['stats.epoch', 'checkpoints.0.epoch'],
      values: {
        stats: { epoch: 1 },
        checkpoints: [{ epoch: 1 }],
      },
    })

    expect(
      new ConfigHealthService().checkConfigHealth(CONFIG, discovery),
    ).toEqual([])
  })

  it('reports nonexistent nested value paths in template health', () => {
    const discovery = makeDiscovery({
      template: TEMPLATE_ID,
      values: { stats: { epoch: 1 } },
    })
    const template = StructureContract.parse({
      ignoreInWatchMode: ['stats.epoch', 'stats.missing'],
    })

    expect(
      new ConfigHealthService().checkTemplateHealth(
        template,
        [discovery],
        TEMPLATE_ID,
      ),
    ).toEqual([
      {
        source: 'template',
        target: { templateId: TEMPLATE_ID },
        excess: {
          ignoreInWatchMode: ['stats.missing'],
          ignoreMethods: [],
          ignoreRelatives: [],
        },
      },
    ])
  })
})

function makeDiscovery(
  entry: Omit<EntryParameters, 'type' | 'address'>,
): DiscoveryOutput {
  return {
    name: CONFIG.name,
    timestamp: 0,
    entries: [{ type: 'Contract', address: ADDRESS, ...entry }],
    abis: {},
    configHash: Hash256.ZERO,
    usedTemplates: {},
    usedBlockNumbers: {},
  }
}
