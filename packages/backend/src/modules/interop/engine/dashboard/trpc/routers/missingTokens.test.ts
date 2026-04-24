import type { Database, InteropMissingTokenInfo } from '@l2beat/database'
import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../trpc'
import { createMissingTokensRouter } from './missingTokens'

describe(createMissingTokensRouter.name, () => {
  it('classifies rows using live TokenDB data', async () => {
    const missingAddress = EthereumAddress.random()
    const incompleteAddress = EthereumAddress.random()
    const readyAddress = EthereumAddress.random()
    const normalizedMissingAddress = missingAddress.toLowerCase()
    const normalizedIncompleteAddress = incompleteAddress.toLowerCase()
    const normalizedReadyAddress = readyAddress.toLowerCase()

    const getMissingTokensInfo = mockFn().resolvesTo([
      missingTokenInfo('ethereum', Address32.from(missingAddress), 5),
      missingTokenInfo('base', Address32.from(incompleteAddress), 3),
      missingTokenInfo('arbitrum', Address32.from(readyAddress), 2),
      missingTokenInfo('ethereum', Address32.ZERO, 1),
    ])
    const query = mockFn().resolvesTo([
      {
        deployedToken: {
          chain: 'base',
          address: normalizedIncompleteAddress,
          symbol: 'INC',
          decimals: 18,
        },
        abstractToken: undefined,
      },
      {
        deployedToken: {
          chain: 'arbitrum',
          address: normalizedReadyAddress,
          symbol: 'READY',
          decimals: 18,
        },
        abstractToken: {
          id: 'ready-token',
          coingeckoId: 'ready-token',
        },
      },
    ])
    const caller = createCaller(
      {
        interopTransfer: mockObject<Database['interopTransfer']>({
          getMissingTokensInfo,
        }),
      },
      query,
    )

    const result = await caller.list()

    expect(getMissingTokensInfo).toHaveBeenCalledTimes(1)
    expect(query).toHaveBeenCalledWith([
      { chain: 'ethereum', address: normalizedMissingAddress },
      { chain: 'base', address: normalizedIncompleteAddress },
      { chain: 'arbitrum', address: normalizedReadyAddress },
    ])
    expect(result).toEqual([
      {
        chain: 'ethereum',
        tokenAddress: Address32.from(missingAddress),
        count: 5,
        plugins: ['plugin'],
        tokenDbStatus: 'missing',
      },
      {
        chain: 'base',
        tokenAddress: Address32.from(incompleteAddress),
        count: 3,
        plugins: ['plugin'],
        tokenDbStatus: 'incomplete',
      },
      {
        chain: 'arbitrum',
        tokenAddress: Address32.from(readyAddress),
        count: 2,
        plugins: ['plugin'],
        tokenDbStatus: 'ready',
      },
      {
        chain: 'ethereum',
        tokenAddress: Address32.ZERO,
        count: 1,
        plugins: ['plugin'],
        tokenDbStatus: 'unsupported',
      },
    ])
  })

  it('requeues only ready rows and returns counts', async () => {
    const readyAddress = EthereumAddress.random()
    const missingAddress = EthereumAddress.random()
    const incompleteAddress = EthereumAddress.random()
    const normalizedReadyAddress = readyAddress.toLowerCase()
    const normalizedMissingAddress = missingAddress.toLowerCase()
    const normalizedIncompleteAddress = incompleteAddress.toLowerCase()
    const markAsUnprocessedByTokens = mockFn().resolvesTo(4)
    const query = mockFn().resolvesTo([
      {
        deployedToken: {
          chain: 'ethereum',
          address: normalizedReadyAddress,
          symbol: 'READY',
          decimals: 18,
        },
        abstractToken: {
          id: 'ready-token',
          coingeckoId: 'ready-token',
        },
      },
      {
        deployedToken: {
          chain: 'base',
          address: normalizedIncompleteAddress,
          symbol: 'INC',
          decimals: 18,
        },
        abstractToken: {
          id: 'incomplete-token',
          coingeckoId: null,
        },
      },
    ])
    const caller = createCaller(
      {
        interopTransfer: mockObject<Database['interopTransfer']>({
          markAsUnprocessedByTokens,
        }),
      },
      query,
    )

    const result = await caller.requeue([
      {
        chain: 'ethereum',
        tokenAddress: Address32.from(readyAddress),
      },
      {
        chain: 'ethereum',
        tokenAddress: Address32.from(readyAddress),
      },
      {
        chain: 'arbitrum',
        tokenAddress: Address32.from(missingAddress),
      },
      {
        chain: 'base',
        tokenAddress: Address32.from(incompleteAddress),
      },
      {
        chain: 'ethereum',
        tokenAddress: Address32.ZERO,
      },
    ])

    expect(query).toHaveBeenCalledWith([
      { chain: 'ethereum', address: normalizedReadyAddress },
      { chain: 'arbitrum', address: normalizedMissingAddress },
      { chain: 'base', address: normalizedIncompleteAddress },
    ])
    expect(markAsUnprocessedByTokens).toHaveBeenCalledWith([
      {
        chain: 'ethereum',
        tokenAddress: Address32.from(readyAddress),
      },
    ])
    expect(result).toEqual({
      updatedTransfers: 4,
      requestedTokenCount: 1,
      skippedTokenCount: 3,
    })
  })
})

function createCaller(db: Partial<Database>, query: ReturnType<typeof mockFn>) {
  const callerFactory = createCallerFactory(
    createMissingTokensRouter({
      chains: [
        { id: 'ethereum', type: 'evm' },
        { id: 'arbitrum', type: 'evm' },
        { id: 'base', type: 'evm' },
      ],
      tokenDbClient: mockObject<TokenDbClient>({
        deployedTokens: { getByChainAndAddress: { query } },
      } as any),
    }),
  )

  return callerFactory({
    headers: new Headers(),
    db: mockObject<Database>(db),
    session: { email: 'user@example.com' },
  })
}

function missingTokenInfo(
  chain: string,
  tokenAddress: string,
  count: number,
): InteropMissingTokenInfo & { chain: string; tokenAddress: string } {
  return {
    chain,
    tokenAddress,
    count,
    plugins: ['plugin'],
  }
}
