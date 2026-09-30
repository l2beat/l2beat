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
      expect(config.ignoreMethods).toEqual(['fromTemplate', 'fromOverride'])
      expect(config.address).toEqual(ADDRESS)
    })

    it('unions ignore lists from both sides instead of merging them by index', () => {
      const config = mergeTemplateIntoOverride(
        {
          ignoreMethods: ['x'],
          ignoreRelatives: ['r1'],
          ignoreInWatchMode: ['w1'],
        },
        {
          ignoreMethods: ['a', 'b', 'x'],
          ignoreRelatives: ['r2'],
          ignoreInWatchMode: ['w2'],
        },
      )

      expect(config.ignoreMethods).toEqual(['a', 'b', 'x'])
      expect(config.ignoreRelatives).toEqual(['r2', 'r1'])
      expect(config.ignoreInWatchMode).toEqual(['w2', 'w1'])
    })

    it('replaces a field edit program wholesale instead of merging by index', () => {
      const config = mergeTemplateIntoOverride(
        { fields: { a: { edit: ['get', '#'] } } },
        { fields: { a: { edit: ['set', ['a', 'b'], '#'] } } },
      )

      expect(config.fields.a?.edit).toEqual(['get', '#'])
    })

    it('crashes when a template handler meets an override copy on one field', () => {
      expect(() =>
        mergeTemplateIntoOverride(
          { fields: { a: { copy: 'b' } } },
          { fields: { a: { handler: { type: 'storage', slot: 1 } } } },
        ),
      ).toThrow('handler and copy cannot both be defined')
    })

    it('crashes when a template copy meets an override handler on one field', () => {
      expect(() =>
        mergeTemplateIntoOverride(
          { fields: { a: { handler: { type: 'storage', slot: 1 } } } },
          { fields: { a: { copy: 'b' } } },
        ),
      ).toThrow('handler and copy cannot both be defined')
    })

    it('replaces a redefined template type wholesale instead of merging its keys', () => {
      const config = mergeTemplateIntoOverride(
        { types: { GameMap: { severity: 'HIGH' } } },
        {
          types: {
            GameMap: {
              typeCaster: 'Mapping',
              arg: { '0': 'FaultDisputeGame' },
            },
          },
        },
      )

      expect(config.types).toEqual({ GameMap: { severity: 'HIGH' } })
    })

    it('replaces a redefined project type wholesale instead of merging its keys', () => {
      const config = makeEntryStructureConfig(
        {
          types: {
            GameMap: {
              typeCaster: 'Mapping',
              arg: { '0': 'FaultDisputeGame' },
            },
          },
          overrides: {
            [ADDRESS.toString()]: StructureContract.parse({
              types: { GameMap: { severity: 'HIGH' } },
            }),
          },
        },
        ADDRESS,
      )

      expect(config.types).toEqual({ GameMap: { severity: 'HIGH' } })
    })

    it('does not mutate the template it merges in', () => {
      const template = StructureContract.parse({
        ignoreMethods: ['a'],
        fields: { f: { handler: { type: 'storage', slot: 1 } } },
      })
      const before = structuredClone(template)

      const config = makeEntryStructureConfig(
        {
          overrides: {
            [ADDRESS.toString()]: StructureContract.parse({
              ignoreMethods: ['b'],
              fields: { f: { template: 'x' } },
            }),
          },
        },
        ADDRESS,
      )
      config.pushValues(template)

      expect(template).toEqual(before)
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

    it('merges a contract field that is itself named handler', () => {
      const config = mergeTemplateIntoOverride(
        { fields: { handler: { template: 'from override' } } },
        {
          fields: {
            handler: {
              handler: { type: 'storage', slot: 1 },
              template: 'from template',
            },
          },
        },
      )

      expect(config.fields?.handler?.handler).toEqual({
        type: 'storage',
        slot: 1,
      })
      expect(config.fields?.handler?.template).toEqual('from override')
    })
  })
})
