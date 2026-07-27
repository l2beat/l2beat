import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { StructureContract } from './StructureConfig'
import { makeEntryStructureConfig } from './structureUtils'

describe('structureUtils', () => {
  describe('pushValues (applying a template onto an override)', () => {
    const ADDRESS = ChainSpecificAddress.random()

    function configFor(override: Record<string, unknown>) {
      return makeEntryStructureConfig(
        {
          overrides: {
            [ADDRESS.toString()]: StructureContract.parse(override),
          },
        },
        ADDRESS,
      )
    }

    it('keeps a template ignoreRelatives wildcard (true) over an empty override', () => {
      // The override has no ignoreRelatives, so it carries the schema default
      // []. Merging a template `true` must not collapse back to that array.
      const config = configFor({})
      config.pushValues(StructureContract.parse({ ignoreRelatives: true }))
      expect(config.ignoreRelatives).toEqual(true)
    })

    it('keeps an override ignoreRelatives wildcard (true) under an array template', () => {
      const config = configFor({ ignoreRelatives: true })
      config.pushValues(StructureContract.parse({ ignoreRelatives: ['a'] }))
      expect(config.ignoreRelatives).toEqual(true)
    })

    it('keeps a template ignoreRelatives field list over an empty override', () => {
      const config = configFor({})
      config.pushValues(
        StructureContract.parse({ ignoreRelatives: ['getTransmitters'] }),
      )
      expect(config.ignoreRelatives).toEqual(['getTransmitters'])
    })
  })
})
