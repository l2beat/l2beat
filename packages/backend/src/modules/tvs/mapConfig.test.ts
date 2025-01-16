import { layer2ToBackendProject, layer2s } from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mapConfig } from './mapConfig'

describe(mapConfig.name, () => {
  it("should map arbitrum's escrows to tokens", async () => {
    const arbitrum = layer2s.find((l) => l.id === ProjectId('arbitrum'))

    assert(arbitrum, 'Arbitrum not found')
    assert(arbitrum.chainConfig, 'Arbitrum chain config not defined')

    const backendProject = layer2ToBackendProject(arbitrum)

    const result = mapConfig(backendProject, arbitrum.chainConfig.name)

    expect(result.projectId).toEqual(ProjectId('arbitrum'))
    expect(result.tokens.length).toBeGreaterThanOrEqual(403)

    expect(result.tokens[0]).toEqual({
      id: 'ethereum-native',
      category: 'ether',
      source: 'canonical',
      decimals: 18,

      address: undefined,
      amount: {
        operator: 'balanceOfEscrow',
        arguments: [
          '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
          '0xcEe284F754E854890e311e3280b767F80797180d',
          '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
          '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
        ],
      },
      chain: 'arbitrum',
      ticker: 'ETH',
      sinceTimestamp: new UnixTime(1622243344),
      untilTimestamp: undefined,
      isAssociated: false,
    })

    expect(result.tokens.find((t) => t.ticker === 'ARB')).toEqual({
      id: 'ethereum-0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
      category: 'other',
      source: 'canonical',
      decimals: 18,
      address: EthereumAddress('0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1'),
      amount: {
        operator: 'balanceOfEscrow',
        arguments: [
          '0xcEe284F754E854890e311e3280b767F80797180d',
          '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
        ],
      },
      chain: 'arbitrum',
      ticker: 'ARB',
      sinceTimestamp: new UnixTime(1623784100),
      untilTimestamp: undefined,
      isAssociated: true,
    })
  })
})
