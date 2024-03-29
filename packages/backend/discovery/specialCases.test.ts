import { assert } from '@l2beat/backend-tools'
import { ConfigReader } from '@l2beat/discovery'
import { expect } from 'earl'

describe('specialCases', () => {
  it('blobstream functionId is correct', async () => {
    const configReader = new ConfigReader()
    const blobstreamConfig = await configReader.readConfig('blobstream', 'base')

    const blobstreamDiscovery = await configReader.readDiscovery(
      'blobstream',
      'base',
    )

    const configOverride =
      blobstreamConfig.overrides.get('SuccinctGateway').fields?.[
        'blobstreamVerifier'
      ]
    assert(configOverride, 'blobstreamVerifier not found in config')
    assert(
      configOverride.type === 'call',
      'blobstreamVerifier not found in config',
    )
    const configFunctionId = configOverride.args[0]

    const discoveryBlobstream = blobstreamDiscovery.contracts.find(
      (c) => c.name === 'BlobstreamX',
    )
    assert(discoveryBlobstream, 'BlobstreamX not found in discovery')

    const discoveryFunctionId = discoveryBlobstream.values
      ?.headerRangeFunctionId as string

    // If this test fails, it means that the functionId in the config.jsonc file
    // does not match the functionId in the discovered.json file.
    // Probably the functionId in the config.jsonc file is outdated.
    // Update the functionId in the config.jsonc file to match the one in the discovered.json file.
    expect(configFunctionId).toEqual(discoveryFunctionId)
  })
})
