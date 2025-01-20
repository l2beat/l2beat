import { layer2ToBackendProject } from '@l2beat/backend-shared'
import { layer2s } from '@l2beat/config'
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

    const result = mapConfig(backendProject, arbitrum.chainConfig)

    expect(result.projectId).toEqual(ProjectId('arbitrum'))
    expect(result.tokens.length).toBeGreaterThanOrEqual(501)

    expect(result.tokens[0]).toEqual({
      id: 'ethereum-native',
      ticker: 'ETH',
      amount: {
        type: 'balanceOfEscrow',
        address: EthereumAddress.ZERO,
        chain: 'arbitrum',
        escrowAddresses: [
          '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
          '0xcEe284F754E854890e311e3280b767F80797180d',
          '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
          '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
        ],
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1622243344),
      untilTimestamp: undefined,
      category: 'ether',
      source: 'canonical',
      isAssociated: false,
    })

    expect(
      result.tokens.find(
        (t) => t.id === 'ethereum-0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
      ),
    ).toEqual({
      id: 'ethereum-0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
      ticker: 'ARB',
      amount: {
        type: 'balanceOfEscrow',
        address: EthereumAddress('0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1'),
        chain: 'arbitrum',
        escrowAddresses: [
          '0xcEe284F754E854890e311e3280b767F80797180d',
          '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
        ],
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1623784100),
      untilTimestamp: undefined,
      category: 'other',
      source: 'canonical',
      isAssociated: true,
    })

    expect(
      result.tokens.find(
        (t) => t.id === 'arbitrum-0x912CE59144191C1204E64559FE8253a0e49E6548',
      ),
    ).toEqual({
      id: 'arbitrum-0x912CE59144191C1204E64559FE8253a0e49E6548',
      ticker: 'ARB',
      amount: {
        type: 'circulatingSupply',
        ticker: 'ARB',
      },
      sinceTimestamp: new UnixTime(1679529600),
      untilTimestamp: undefined,
      category: 'other',
      source: 'native',
      isAssociated: true,
    })

    expect(
      result.tokens.find(
        (t) => t.id === 'arbitrum-0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
      ),
    ).toEqual({
      id: 'arbitrum-0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
      ticker: 'stAethir',
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0xc87B37a581ec3257B734886d9d3a581F5A9d056c'),
        chain: 'arbitrum',
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1718150400),
      untilTimestamp: undefined,
      category: 'other',
      source: 'external',
      isAssociated: false,
    })
  })
})
