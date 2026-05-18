import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenDatabase,
} from '@l2beat/database'
import type { AbstractTokenRepository } from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Command } from './commands'
import { commitTokenChanges } from './commitTokenChanges'

describe(commitTokenChanges.name, () => {
  it('routes each command kind to the matching repository call in order', async () => {
    const abstractToken = mockObject<AbstractTokenRepository>({
      insert: mockFn().resolvesTo(undefined),
      updateById: mockFn().resolvesTo(undefined),
      deleteById: mockFn().resolvesTo(undefined),
      deleteAll: mockFn().resolvesTo(undefined),
    })
    const deployedToken = mockObject<DeployedTokenRepository>({
      insert: mockFn().resolvesTo(undefined),
      updateByChainAndAddress: mockFn().resolvesTo(undefined),
      deleteByPrimaryKey: mockFn().resolvesTo(undefined),
      deleteAll: mockFn().resolvesTo(undefined),
    })
    const tokenDb = mockObject<TokenDatabase>({ abstractToken, deployedToken })

    const abstract = abstractRecord('USDC01', 'USDC')
    const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')

    const commands: Command[] = [
      { type: 'AddAbstractTokenCommand', record: abstract },
      {
        type: 'UpdateAbstractTokenCommand',
        id: abstract.id,
        existing: abstract,
        update: { symbol: 'USDC2' },
      },
      { type: 'DeleteAbstractTokenCommand', id: abstract.id },
      { type: 'DeleteAllAbstractTokensCommand' },
      { type: 'AddDeployedTokenCommand', record: deployed },
      {
        type: 'UpdateDeployedTokenCommand',
        pk: { chain: deployed.chain, address: deployed.address },
        existing: deployed,
        update: { symbol: 'USDC2' },
      },
      {
        type: 'DeleteDeployedTokenCommand',
        pk: { chain: deployed.chain, address: deployed.address },
      },
      { type: 'DeleteAllDeployedTokensCommand' },
    ]

    await commitTokenChanges(tokenDb, commands)

    expect(abstractToken.insert).toHaveBeenOnlyCalledWith(abstract)
    expect(abstractToken.updateById).toHaveBeenOnlyCalledWith(abstract.id, {
      symbol: 'USDC2',
    })
    expect(abstractToken.deleteById).toHaveBeenOnlyCalledWith(abstract.id)
    expect(abstractToken.deleteAll).toHaveBeenCalledTimes(1)
    expect(deployedToken.insert).toHaveBeenOnlyCalledWith(deployed)
    expect(deployedToken.updateByChainAndAddress).toHaveBeenOnlyCalledWith(
      { chain: deployed.chain, address: deployed.address },
      { symbol: 'USDC2' },
    )
    expect(deployedToken.deleteByPrimaryKey).toHaveBeenOnlyCalledWith({
      chain: deployed.chain,
      address: deployed.address,
    })
    expect(deployedToken.deleteAll).toHaveBeenCalledTimes(1)
  })

  it('passes deployed-token commands through verbatim, including any proof field', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const updateByChainAndAddress = mockFn().resolvesTo(undefined)
    const tokenDb = mockObject<TokenDatabase>({
      deployedToken: mockObject<DeployedTokenRepository>({
        insert,
        updateByChainAndAddress,
      }),
    })
    const deployed: DeployedTokenRecord = {
      ...deployedRecord('ethereum', '0xaaa', 'USDC01'),
      abstractTokenAssignmentProof: { kind: 'manual', user: 'someone@x.io' },
    }
    const pk = { chain: deployed.chain, address: deployed.address }

    await commitTokenChanges(tokenDb, [
      { type: 'AddDeployedTokenCommand', record: deployed },
      {
        type: 'UpdateDeployedTokenCommand',
        pk,
        existing: deployed,
        update: {
          abstractTokenId: 'USDT01',
          abstractTokenAssignmentProof: { kind: 'coingecko' },
        },
      },
    ])

    expect(insert).toHaveBeenOnlyCalledWith(deployed)
    expect(updateByChainAndAddress).toHaveBeenOnlyCalledWith(pk, {
      abstractTokenId: 'USDT01',
      abstractTokenAssignmentProof: { kind: 'coingecko' },
    })
  })
})

function abstractRecord(id: string, symbol: string): AbstractTokenRecord {
  return {
    id,
    issuer: null,
    symbol,
    category: null,
    iconUrl: null,
    coingeckoId: null,
    coingeckoListingTimestamp: null,
    comment: null,
    reviewed: false,
  }
}

function deployedRecord(
  chain: string,
  shortAddress: string,
  abstractTokenId: string,
): DeployedTokenRecord {
  return {
    chain,
    address: `0x${shortAddress.slice(2).padStart(40, '0')}`,
    abstractTokenId,
    symbol: 'USDC',
    decimals: 6,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    metadata: null,
  }
}
