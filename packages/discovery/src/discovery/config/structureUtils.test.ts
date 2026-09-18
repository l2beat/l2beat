import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
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

      expect(config.ignoreRelatives).toEqual(true)
    })

    it('keeps a template wildcard over an override field list', () => {
      const config = mergeTemplateIntoOverride(
        { ignoreRelatives: ['owner'] },
        { ignoreRelatives: true },
      )

      expect(config.ignoreRelatives).toEqual(true)
    })

    it('keeps an override wildcard over a template field list', () => {
      const config = mergeTemplateIntoOverride(
        { ignoreRelatives: true },
        { ignoreRelatives: ['getTransmitters'] },
      )

      expect(config.ignoreRelatives).toEqual(true)
    })

    it('keeps the wildcard when both sides set it', () => {
      const config = mergeTemplateIntoOverride(
        { ignoreRelatives: true },
        { ignoreRelatives: true },
      )

      expect(config.ignoreRelatives).toEqual(true)
    })

    it('takes a template field list when the override sets no ignoreRelatives', () => {
      const config = mergeTemplateIntoOverride(
        {},
        { ignoreRelatives: ['getTransmitters'] },
      )

      expect(config.ignoreRelatives).toEqual(['getTransmitters'])
    })

    it('leaves ignoreRelatives empty when neither side sets it', () => {
      const config = mergeTemplateIntoOverride({}, {})

      expect(config.ignoreRelatives).toEqual([])
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

      expect(config.ignoreRelatives).toEqual(true)
      expect(config.ignoreDiscovery).toEqual(true)
      expect(config.ignoreMethods).toEqual(['fromOverride'])
      expect(config.address).toEqual(ADDRESS)
    })

    it('replaces a template handler with the override handler instead of merging them', () => {
      const config = mergeTemplateIntoOverride(
        {
          fields: {
            sequencerInbox: {
              handler: { type: 'hardcoded', value: 'eth:0xff00' },
            },
          },
        },
        {
          fields: {
            sequencerInbox: {
              handler: {
                type: 'opStackSequencerInbox',
                sequencerAddress: '{{ batcherHash }}',
              },
            },
          },
        },
      )

      expect(config.fields?.sequencerInbox?.handler).toEqual({
        type: 'hardcoded',
        value: 'eth:0xff00',
      })
    })

    it('keeps the template handler when the override sets none', () => {
      const config = mergeTemplateIntoOverride(
        { fields: { sequencerInbox: { template: 'from override' } } },
        {
          fields: {
            sequencerInbox: {
              handler: {
                type: 'opStackSequencerInbox',
                sequencerAddress: '{{ batcherHash }}',
              },
            },
          },
        },
      )

      expect(config.fields?.sequencerInbox?.handler).toEqual({
        type: 'opStackSequencerInbox',
        sequencerAddress: '{{ batcherHash }}',
      })
      expect(config.fields?.sequencerInbox?.template).toEqual('from override')
    })
  })
})
