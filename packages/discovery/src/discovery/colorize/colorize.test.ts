import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { TemplateService } from '../analysis/TemplateService'
import { ColorConfig, ColorContract } from '../config/ColorConfig'
import type { StructureEntry, StructureOutput } from '../output/types'
import { colorize } from './colorize'

describe(colorize.name, () => {
  const PROXY = ChainSpecificAddress.random()
  const IMPLEMENTATION = ChainSpecificAddress.random()
  const EOA = ChainSpecificAddress.random()

  const templateService = mockObject<TemplateService>({
    loadContractTemplateColor: () => ColorContract.parse({}),
  })

  function colorizeNames(names: Record<string, string>) {
    const previouslyColorized: StructureEntry[] = [
      {
        type: 'Contract',
        address: PROXY,
        name: 'RenamedProxy',
        implementationNames: {
          [PROXY]: 'TransparentUpgradeableProxy',
          [IMPLEMENTATION]: 'Timelock',
        },
      },
      { type: 'EOA', address: EOA, name: 'RenamedEOA' },
    ]
    const color = colorize(
      ColorConfig.parse({ names }),
      structureOf(previouslyColorized),
      templateService,
    )
    return color.entries.map((entry) => entry.name)
  }

  it('takes names from the config', () => {
    const names = colorizeNames({ [PROXY]: 'Timelock2', [EOA]: 'Multisig' })

    expect(names).toEqual(['Timelock2', 'Multisig'])
  })

  it('restores the discovered names once the config no longer renames them', () => {
    expect(colorizeNames({})).toEqual(['Timelock', undefined])
  })
})

function structureOf(entries: StructureEntry[]): StructureOutput {
  return {
    name: 'project',
    timestamp: 0,
    entries,
    abis: {},
    configHash: Hash256.random(),
    usedTemplates: {},
    usedBlockNumbers: {},
  }
}
