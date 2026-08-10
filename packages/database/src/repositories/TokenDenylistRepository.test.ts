import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import { TokenDenylistRepository } from './TokenDenylistRepository'

describeTokenDatabase(TokenDenylistRepository.name, (db) => {
  const repository = db.tokenDenylist

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('inserts entries, normalizing the address to lower-case', async () => {
    await repository.insert({
      chain: 'arbitrum',
      address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      reason: 'test token',
    })

    const stored = await repository.getAll()
    expect(stored.map(({ createdAt: _, ...entry }) => entry)).toEqual([
      {
        chain: 'arbitrum',
        address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        reason: 'test token',
      },
    ])
    expect(stored[0]?.createdAt).toBeGreaterThan(0)
  })

  it('finds an entry with case-insensitive address matching', async () => {
    await repository.insert({
      chain: 'arbitrum',
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      reason: 'test token',
    })

    const found = await repository.findByChainAndAddress({
      chain: 'arbitrum',
      address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    })
    expect(found?.reason).toEqual('test token')

    const missing = await repository.findByChainAndAddress({
      chain: 'ethereum',
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    })
    expect(missing).toEqual(undefined)
  })

  it('deletes an entry by primary key', async () => {
    await repository.insert({
      chain: 'arbitrum',
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      reason: 'test token',
    })

    const deleted = await repository.deleteByPrimaryKey({
      chain: 'arbitrum',
      address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    })
    expect(deleted).toEqual(1)
    expect(await repository.getAll()).toEqual([])
  })
})
