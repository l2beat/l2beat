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
import {
  type AbstractTokenAssignmentProof,
  commitTokenChanges,
  type WriteSource,
} from './commitTokenChanges'

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

    await commitTokenChanges(tokenDb, commands, userSource())

    expect(abstractToken.insert).toHaveBeenOnlyCalledWith(abstract)
    expect(abstractToken.updateById).toHaveBeenOnlyCalledWith(abstract.id, {
      symbol: 'USDC2',
    })
    expect(abstractToken.deleteById).toHaveBeenOnlyCalledWith(abstract.id)
    expect(abstractToken.deleteAll).toHaveBeenCalledTimes(1)
    expect(deployedToken.insert).toHaveBeenOnlyCalledWith({
      ...deployed,
      abstractTokenAssignmentProof: { kind: 'manual' },
    })
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

  it('stamps the ingestion proof on AddDeployedTokenCommand', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const tokenDb = mockObject<TokenDatabase>({
      deployedToken: mockObject<DeployedTokenRepository>({ insert }),
    })
    const proof: AbstractTokenAssignmentProof = { kind: 'coingecko' }
    const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')

    await commitTokenChanges(
      tokenDb,
      [{ type: 'AddDeployedTokenCommand', record: deployed }],
      { kind: 'ingestion', proof },
    )

    expect(insert).toHaveBeenOnlyCalledWith({
      ...deployed,
      abstractTokenAssignmentProof: proof,
    })
  })

  it('writes null proof when AddDeployedTokenCommand has no abstract token', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const tokenDb = mockObject<TokenDatabase>({
      deployedToken: mockObject<DeployedTokenRepository>({ insert }),
    })
    const deployed: DeployedTokenRecord = {
      ...deployedRecord('ethereum', '0xaaa', 'USDC01'),
      abstractTokenId: null,
    }

    await commitTokenChanges(
      tokenDb,
      [{ type: 'AddDeployedTokenCommand', record: deployed }],
      userSource(),
    )

    expect(insert).toHaveBeenOnlyCalledWith({
      ...deployed,
      abstractTokenAssignmentProof: null,
    })
  })

  it('stamps proof on UpdateDeployedTokenCommand only when abstractTokenId changes', async () => {
    const updateByChainAndAddress = mockFn().resolvesTo(undefined)
    const tokenDb = mockObject<TokenDatabase>({
      deployedToken: mockObject<DeployedTokenRepository>({
        updateByChainAndAddress,
      }),
    })
    const deployed = deployedRecord('ethereum', '0xaaa', 'USDC01')
    const pk = { chain: deployed.chain, address: deployed.address }

    await commitTokenChanges(
      tokenDb,
      [
        {
          type: 'UpdateDeployedTokenCommand',
          pk,
          existing: deployed,
          update: { abstractTokenId: 'USDT01' },
        },
        {
          type: 'UpdateDeployedTokenCommand',
          pk,
          existing: deployed,
          update: { symbol: 'X' },
        },
        {
          type: 'UpdateDeployedTokenCommand',
          pk,
          existing: deployed,
          update: { abstractTokenId: deployed.abstractTokenId, symbol: 'Y' },
        },
        {
          type: 'UpdateDeployedTokenCommand',
          pk,
          existing: deployed,
          update: { abstractTokenId: null },
        },
      ],
      userSource(),
    )

    expect(updateByChainAndAddress).toHaveBeenCalledTimes(4)
    expect(updateByChainAndAddress).toHaveBeenNthCalledWith(1, pk, {
      abstractTokenId: 'USDT01',
      abstractTokenAssignmentProof: { kind: 'manual' },
    })
    expect(updateByChainAndAddress).toHaveBeenNthCalledWith(2, pk, {
      symbol: 'X',
    })
    expect(updateByChainAndAddress).toHaveBeenNthCalledWith(3, pk, {
      abstractTokenId: deployed.abstractTokenId,
      symbol: 'Y',
    })
    expect(updateByChainAndAddress).toHaveBeenNthCalledWith(4, pk, {
      abstractTokenId: null,
      abstractTokenAssignmentProof: null,
    })
  })
})

function userSource(): WriteSource {
  return { kind: 'user', email: 'user@example.com' }
}

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
