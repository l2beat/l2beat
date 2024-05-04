import { assert } from '@l2beat/backend-tools'
import { ConfigReader } from '@l2beat/discovery'
import { expect } from 'earl'

describe('specialCases', () => {
  describe('Blobstream functionIds in config.json are up-to-date?', () => {
    it('FunctionIDs from BlobstreamX contract discovery should match the call args in config.json.', async () => {
      const configReader = new ConfigReader()
      const blobstreamConfig = await configReader.readConfig('blobstream', 'base')
      const blobstreamDiscovery = await configReader.readDiscovery('blobstream', 'base')

      const configOverrides = getConfigOverrides(blobstreamConfig)
      const discoveryBlobstream = getDiscoveryBlobstream(blobstreamDiscovery)

      // Define test cases for function ID checks
      const cases = [
        ['nextHeaderFunctionId', 'nextHeaderVerifier', 'nextHeaderProvers', 'nextHeaderVerifierOwner'],
        ['headerRangeFunctionId', 'headerRangeVerifier', 'headerRangeProvers', 'headerRangeVerifierOwner'],
      ]

      // Check the function IDs and argValues
      await Promise.all(cases.map(async ([valueKey, override, prover, verifierOwner]) => {
        const configFunctionId = getConfigFunctionId(configOverrides, override)
        const discoveryFunctionId = getDiscoveryFunctionId(discoveryBlobstream, valueKey)

        expect(configFunctionId).toEqual(discoveryFunctionId)

        const proverArgValue = getConfigArgValue(configOverrides, prover)
        expect(proverArgValue).toEqual(discoveryFunctionId)

        const verifierOwnerArg = getConfigCallArg(configOverrides, verifierOwner, 0)
        expect(verifierOwnerArg).toEqual(discoveryFunctionId)
      }))
    })
  })
})

function getConfigOverrides(blobstreamConfig: any) {
  const configOverrides = blobstreamConfig.overrides.get('SuccinctGateway')
  assert(configOverrides, 'SuccinctGateway not found in config')
  return configOverrides
}

function getDiscoveryBlobstream(blobstreamDiscovery: any) {
  const discoveryBlobstream = blobstreamDiscovery.contracts.find((c: any) => c.name === 'BlobstreamX')
  assert(discoveryBlobstream, 'BlobstreamX not found in discovery')
  return discoveryBlobstream
}

function getConfigFunctionId(configOverrides: any, override: string) {
  const configOverride = configOverrides.fields?.[override]
  assert(configOverride, override + ' not found in config')
  assert(configOverride.type === 'call', override + ' is not a call')
  return configOverride.args[0]
}

function getDiscoveryFunctionId(discoveryBlobstream: any, valueKey: string) {
  const discoveryFunctionId = discoveryBlobstream.values?.[valueKey]
  assert(discoveryFunctionId, valueKey + ' not found in discovery')
  return discoveryFunctionId
}

function getConfigArgValue(configOverrides: any, fieldName: string) {
  const field = configOverrides.fields[fieldName]
  assert(field, fieldName + ' not found in config')
  return field.argValue
}

function getConfigCallArg(configOverrides: any, functionName: string, argIndex: number) {
  const functionConfig = configOverrides.fields[functionName]
  assert(functionConfig, functionName + ' not found in config')
  assert(functionConfig.args.length > argIndex, `Argument index ${argIndex} out of range for ${functionName}`)
  return functionConfig.args[argIndex]
}
