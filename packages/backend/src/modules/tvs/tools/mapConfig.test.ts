import { Logger } from '@l2beat/backend-tools'
import { ProjectService, type TvsToken } from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  ProjectId,
  TokenId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mapConfig } from './mapConfig'

describe(mapConfig.name, () => {
  it("should map arbitrum's escrows to tokens", async () => {
    const ps = new ProjectService()
    const arbitrum = await ps.getProject({
      id: ProjectId('arbitrum'),
      select: ['tvlConfig', 'chainConfig'],
    })
    assert(arbitrum, 'Arbitrum not found')

    const projectsWithChain = (
      await ps.getProjects({ select: ['chainConfig'] })
    ).map((p) => p.chainConfig)

    const chains = new Map(projectsWithChain.map((p) => [p.name, p]))

    const result = await mapConfig(arbitrum, chains, Logger.SILENT)

    expect(result.projectId).toEqual(ProjectId('arbitrum'))
    expect(result.tokens.length).toBeGreaterThanOrEqual(501)

    expect(
      result.tokens.find((t: TvsToken) => t.id === 'arbitrum-ETH-1'),
    ).toEqual({
      mode: 'auto',
      id: TokenId('arbitrum-ETH-1'),
      priceId: 'ethereum',
      symbol: 'ETH',
      name: 'Ether',
      amount: {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          {
            type: 'balanceOfEscrow',
            address: 'native',
            chain: 'ethereum',
            escrowAddress: EthereumAddress(
              '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
            ),
            decimals: 18,
            sinceTimestamp: UnixTime(1661457944),
          },
          {
            type: 'balanceOfEscrow',
            address: 'native',
            chain: 'ethereum',
            escrowAddress: EthereumAddress(
              '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
            ),
            decimals: 18,
            sinceTimestamp: UnixTime(1623784100),
          },
          {
            type: 'balanceOfEscrow',
            address: 'native',
            chain: 'ethereum',
            escrowAddress: EthereumAddress(
              '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
            ),
            decimals: 18,
            sinceTimestamp: UnixTime(1622243344),
          },
        ],
      },
      category: 'ether',
      source: 'canonical',
      isAssociated: false,
    })

    expect(
      result.tokens.find(
        (t: TvsToken) =>
          t.id === 'arbitrum-ARB-1' && t.amount.type === 'circulatingSupply',
      ),
    ).toEqual({
      mode: 'auto',
      id: TokenId('arbitrum-ARB-1'),
      symbol: 'ARB',
      name: 'Arbitrum',
      priceId: 'arbitrum',
      amount: {
        type: 'circulatingSupply',
        apiId: 'arbitrum',
        decimals: 18,
        sinceTimestamp: UnixTime(1679529600),
      },
      category: 'other',
      source: 'native',
      isAssociated: true,
    })

    expect(
      result.tokens.find((t: TvsToken) => t.id === 'arbitrum-ATH'),
    ).toEqual({
      mode: 'auto',
      id: TokenId('arbitrum-ATH'),
      symbol: 'ATH',
      name: 'Aethir Token',
      priceId: 'aethir',
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0xc87B37a581ec3257B734886d9d3a581F5A9d056c'),
        chain: 'arbitrum',
        decimals: 18,
        sinceTimestamp: UnixTime(1718150400),
      },
      category: 'other',
      source: 'external',
      isAssociated: false,
    })
  })
})
