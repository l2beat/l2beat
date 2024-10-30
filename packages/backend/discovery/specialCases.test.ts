import { ConfigReader } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'

describe('specialCases', () => {
  const configReader = new ConfigReader()

  // Define the chains to be tested
  const chains = [
    { name: 'base', discovery: 'base' },
    { name: 'arbitrum', discovery: 'arbitrum' },
    { name: 'ethereum', discovery: 'ethereum' },
  ]

  // Fetch configuration and discovery data for all chains
  const promises = chains.map(({ name, discovery }) => {
    return Promise.all([
      configReader.readConfig('blobstream', name),
      configReader.readDiscovery('blobstream', discovery),
    ])
  })

  /*

  TODO: fix this test
  
  Promise.all(promises).then((chainData) => {
    chainData.forEach(([config, discovery], index) => {
      const chain = chains[index]
      const configOverrides = getGatewayConfigOverrides(config)
      const discoveryBlobstream = getDiscoveryBlobstream(discovery)

      describe(`Blobstream functionIds in config.json are up-to-date for ${chain.name}?`, () => {
        runTestCases(configOverrides, discoveryBlobstream, chain.name)
      })
    })
  })

  */

  function runTestCases(configOverrides, discoveryBlobstream, chain) {
    const cases = [
      [
        'nextHeaderFunctionId',
        'nextHeaderVerifier',
        'nextHeaderProvers',
        'nextHeaderVerifierOwner',
      ],
      [
        'headerRangeFunctionId',
        'headerRangeVerifier',
        'headerRangeProvers',
        'headerRangeVerifierOwner',
      ],
    ]

    cases.forEach(([valueKey, override, prover, verifierOwner]) => {
      const configFunctionId = getConfigFunctionId(configOverrides, override)
      const discoveryFunctionId = getDiscoveryFunctionId(
        discoveryBlobstream,
        valueKey,
      )

      it(`FunctionIDs from BlobstreamX contract discovery should match the call args in config.json for ${chain}`, () => {
        expect(configFunctionId).toEqual(discoveryFunctionId)
      })

      const proverArgValue = getConfigArgValue(configOverrides, prover)
      it(`Prover argument value from config.json should match discovery for ${chain}`, () => {
        expect(proverArgValue).toEqual(discoveryFunctionId)
      })

      const verifierOwnerArg = getConfigCallArg(
        configOverrides,
        verifierOwner,
        0,
      )
      it(`Verifier owner argument from config.json should match discovery for ${chain}`, () => {
        expect(verifierOwnerArg).toEqual(discoveryFunctionId)
      })
    })
  }

  function getGatewayConfigOverrides(blobstreamConfig) {
    const configOverrides = blobstreamConfig.overrides.get('SuccinctGateway')
    assert(configOverrides, 'SuccinctGateway not found in config')
    return configOverrides
  }

  function getDiscoveryBlobstream(blobstreamDiscovery) {
    const discoveryBlobstream = blobstreamDiscovery.contracts.find(
      (c) => c.name === 'Blobstream',
    )
    assert(discoveryBlobstream, 'Blobstream not found in discovery')
    return discoveryBlobstream
  }

  function getConfigFunctionId(configOverrides, override) {
    const configOverride = configOverrides.fields?.[override]
    assert(configOverride, `${override} not found in config`)
    assert(configOverride.type === 'call', `${override} is not a call`)
    return configOverride.args[0]
  }

  function getDiscoveryFunctionId(discoveryBlobstream, valueKey) {
    const discoveryFunctionId = discoveryBlobstream.values?.[valueKey]
    assert(discoveryFunctionId, `${valueKey} not found in discovery`)
    return discoveryFunctionId
  }

  function getConfigArgValue(configOverrides, fieldName) {
    const field = configOverrides.fields[fieldName]
    assert(field, `${fieldName} not found in config`)
    return field.argValue
  }

  function getConfigCallArg(configOverrides, functionName, argIndex) {
    const functionConfig = configOverrides.fields[functionName]
    assert(functionConfig, `${functionName} not found in config`)
    assert(
      functionConfig.args.length > argIndex,
      `Argument index ${argIndex} out of range for ${functionName}`,
    )
    return functionConfig.args[argIndex]
  }
})
