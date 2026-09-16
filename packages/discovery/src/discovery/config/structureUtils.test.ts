import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import { StructureContract } from './StructureConfig'
import { makeEntryStructureConfig } from './structureUtils'

describe(makeEntryStructureConfig.name, () => {
  describe('pushValues', () => {
    const ADDRESS = ChainSpecificAddress.random()

    // Both sides always carry every key, because `StructureContract.parse`
    // fills in the schema defaults. `ignoreRelatives` defaults to `[]`, which
    // is why merging it against the `true` wildcard needs its own rule.
    function mergeTemplateIntoOverride(
      override: Record<string, unknown>,
      template: Record<string, unknown>,
    ) {
      const config = makeEntryStructureConfig(
        {
          overrides: {
            [ADDRESS.toString()]: StructureContract.parse(override),
          },
        },
        ADDRESS,
      )
      config.pushValues(StructureContract.parse(template))
      return config
    }

    it('keeps a template wildcard when the override sets no ignoreRelatives', () => {
      const config = mergeTemplateIntoOverride({}, { ignoreRelatives: true })

      expect(config.ignoreRelatives).toStrictEqual(true)
    })

    it('keeps a template wildcard over an override field list', () => {
      const config = mergeTemplateIntoOverride(
        { ignoreRelatives: ['owner'] },
        { ignoreRelatives: true },
      )

      expect(config.ignoreRelatives).toStrictEqual(true)
    })

    it('keeps an override wildcard over a template field list', () => {
      const config = mergeTemplateIntoOverride(
        { ignoreRelatives: true },
        { ignoreRelatives: ['getTransmitters'] },
      )

      expect(config.ignoreRelatives).toStrictEqual(true)
    })

    it('keeps the wildcard when both sides set it', () => {
      const config = mergeTemplateIntoOverride(
        { ignoreRelatives: true },
        { ignoreRelatives: true },
      )

      expect(config.ignoreRelatives).toStrictEqual(true)
    })

    it('takes a template field list when the override sets no ignoreRelatives', () => {
      const config = mergeTemplateIntoOverride(
        {},
        { ignoreRelatives: ['getTransmitters'] },
      )

      expect(config.ignoreRelatives).toStrictEqual(['getTransmitters'])
    })

    it('leaves ignoreRelatives empty when neither side sets it', () => {
      const config = mergeTemplateIntoOverride({}, {})

      expect(config.ignoreRelatives).toStrictEqual([])
    })

    it('lets the override win on the other fields while the wildcard applies', () => {
      const config = mergeTemplateIntoOverride(
        {
          ignoreRelatives: ['owner'],
          ignoreDiscovery: true,
          ignoreMethods: ['fromOverride'],
        },
        {
          ignoreRelatives: true,
          ignoreDiscovery: false,
          ignoreMethods: ['fromTemplate'],
        },
      )

      expect(config.ignoreRelatives).toStrictEqual(true)
      expect(config.ignoreDiscovery).toStrictEqual(true)
      expect(config.ignoreMethods).toStrictEqual(['fromOverride'])
      expect(config.address).toStrictEqual(ADDRESS)
    })
  })
})
