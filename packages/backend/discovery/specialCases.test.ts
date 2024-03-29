import { assert } from '@l2beat/backend-tools'
import { ConfigReader } from '@l2beat/discovery'
import { expect } from 'earl'

describe('specialCases', () => {
  describe('blobstream functionIds are correct', async () => {
    const configReader = new ConfigReader()

    const blobstreamConfig = await configReader.readConfig('blobstream', 'base')
    const blobstreamDiscovery = await configReader.readDiscovery(
      'blobstream',
      'base',
    )

    const configOverrides = blobstreamConfig.overrides.get('SuccinctGateway')
    assert(configOverrides, 'SuccinctGateway not found in config')
    const discoveryBlobstream = blobstreamDiscovery.contracts.find(
      (c) => c.name === 'BlobstreamX',
    )
    assert(discoveryBlobstream, 'BlobstreamX not found in discovery')

    const cases = [
      ['nextHeaderFunctionId', 'nextHeaderVerifier'],
      ['headerRangeFunctionId', 'headerRangeVerifier'],
    ]
    for (const [valueKey, override] of cases) {
      const configOverride = configOverrides.fields?.[override]
      assert(configOverride, override + ' not found in config')
      assert(configOverride.type === 'call', override + ' is not a call')

      const configFunctionId = configOverride.args[0]

      const discoveryFunctionId = discoveryBlobstream.values?.[valueKey] as
        | string
        | undefined
      assert(discoveryFunctionId, valueKey + ' not found in discovery')

      // If this test fails, it means that the functionId in the config.jsonc file
      // does not match the functionId in the discovered.json file.
      // Probably the functionId in the config.jsonc file is outdated.
      // Update the functionId in the config.jsonc file to match the one in the discovered.json file.
      it(`${override}:${valueKey}`, () => {
        expect(configFunctionId).toEqual(discoveryFunctionId)
      })
    }
  })
})
