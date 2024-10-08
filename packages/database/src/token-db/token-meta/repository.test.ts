import { expect } from 'earl'
import { TokenMetaRepository } from './repository'
import { UpsertableTokenMetaRecord } from './entity'
import { describeDatabase } from '../../test/database'
import { assert } from '@l2beat/shared-pure'

describeDatabase(TokenMetaRepository.name, (database) => {
  const repository = database.tokenMeta
  let token: [string, string]

  beforeEach(async () => {
    await database.network.upsertMany([
      {
        chainId: 1,
        name: 'Mainnet',
      },
    ])
    const network = await database.network.findByChainId(1)
    assert(network, 'Network must exist')

    await database.token.upsert({
      address: '0x0',
      networkId: network.id,
    })
    await database.token.upsert({
      address: '0x1',
      networkId: network.id,
    })

    const tokens = await database.token.getAll()
    assert(tokens[0] && tokens[1], 'Tokens must exist')
    token = [tokens[0].id, tokens[1].id]
  })

  afterEach(async () => {
    await repository.deleteAll()
    await database.token.deleteAll()
    await database.network.deleteAll()
  })

  describe(TokenMetaRepository.prototype.getAll.name, () => {
    it('returns all token meta records', async () => {
      const record1 = mock({
        tokenId: token[0],
        source: 'test',
        externalId: 'ext1',
        name: 'Token 1',
        symbol: 'TKN1',
        decimals: 18,
        logoUrl: 'http://example.com/logo1.png',
        contractName: 'Token1Contract',
      })
      const record2 = mock({
        tokenId: token[1],
        source: 'test',
        externalId: 'ext2',
        name: 'Token 2',
        symbol: 'TKN2',
        decimals: 6,
        logoUrl: 'http://example.com/logo2.png',
        contractName: 'Token2Contract',
      })

      await repository.upsert(record1)
      await repository.upsert(record2)

      const result = await repository.getAll()
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(mockOutput(record1))
      expect(result[1]).toEqual(mockOutput(record2))
    })
  })

  describe(TokenMetaRepository.prototype.getByTokenId.name, () => {
    it('returns token meta records for a specific token ID', async () => {
      const record1 = mock({
        tokenId: token[0],
        source: 'test1',
        externalId: 'ext1',
        name: 'Token 1',
        symbol: 'TKN1',
        decimals: 18,
        logoUrl: 'http://example.com/logo1.png',
        contractName: 'Token1Contract',
      })
      const record2 = mock({
        tokenId: token[0],
        source: 'test2',
        externalId: 'ext2',
        name: 'Token 1 Alt',
        symbol: 'TKN1A',
        decimals: 18,
        logoUrl: 'http://example.com/logo1a.png',
        contractName: 'Token1AltContract',
      })

      await repository.upsert(record1)
      await repository.upsert(record2)

      const result = await repository.getByTokenId(token[0])
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(mockOutput(record1))
      expect(result[1]).toEqual(mockOutput(record2))
    })
  })

  describe(TokenMetaRepository.prototype.upsert.name, () => {
    it('inserts a new record', async () => {
      const record = mock({
        tokenId: token[0],
        source: 'test',
        externalId: 'ext1',
        name: 'Token 1',
        symbol: 'TKN1',
        decimals: 18,
        logoUrl: 'http://example.com/logo1.png',
        contractName: 'Token1Contract',
      })

      await repository.upsert(record)

      const inserted = await repository.getByTokenId(token[0])
      expect(inserted).toHaveLength(1)
      expect(inserted[0]).toEqual(mockOutput(record))
    })

    it('updates an existing record', async () => {
      const initialRecord = mock({
        tokenId: token[0],
        source: 'test',
        externalId: 'ext1',
        name: 'Token 1',
        symbol: 'TKN1',
        decimals: 18,
        logoUrl: 'http://example.com/logo1.png',
        contractName: 'Token1Contract',
      })

      await repository.upsert(initialRecord)

      const updatedRecord = mock({
        ...initialRecord,
        name: 'Updated Token 1',
        symbol: 'UTKN1',
      })

      await repository.upsert(updatedRecord)

      const updated = await repository.getByTokenId(token[0])
      expect(updated).toHaveLength(1)
      expect(updated[0]).toEqual(mockOutput(updatedRecord))
    })
  })

  describe(TokenMetaRepository.prototype.upsertMany.name, () => {
    it('inserts multiple new records', async () => {
      const records = [
        mock({
          tokenId: token[0],
          source: 'test',
          externalId: 'ext1',
          name: 'Token 1',
          symbol: 'TKN1',
          decimals: 18,
          logoUrl: 'http://example.com/logo1.png',
          contractName: 'Token1Contract',
        }),
        mock({
          tokenId: token[1],
          source: 'test',
          externalId: 'ext2',
          name: 'Token 2',
          symbol: 'TKN2',
          decimals: 6,
          logoUrl: 'http://example.com/logo2.png',
          contractName: 'Token2Contract',
        }),
      ] as [UpsertableTokenMetaRecord, UpsertableTokenMetaRecord]

      const result = await repository.upsertMany(records)
      expect(result).toEqual(2)

      const inserted = await repository.getAll()
      expect(inserted).toHaveLength(2)
      expect(inserted[0]).toEqual(mockOutput(records[0]))
      expect(inserted[1]).toEqual(mockOutput(records[1]))
    })

    it('updates existing records and inserts new ones', async () => {
      const initialRecord = mock({
        tokenId: token[0],
        source: 'test',
        externalId: 'ext1',
        name: 'Token 1',
        symbol: 'TKN1',
        decimals: 18,
        logoUrl: 'http://example.com/logo1.png',
        contractName: 'Token1Contract',
      })

      await repository.upsertMany([initialRecord])

      const updatedAndNewRecords = [
        mock({
          ...initialRecord,
          name: 'Updated Token 1',
          symbol: 'UTKN1',
        }),
        mock({
          tokenId: token[1],
          source: 'test',
          externalId: 'ext2',
          name: 'Token 2',
          symbol: 'TKN2',
          decimals: 6,
          logoUrl: 'http://example.com/logo2.png',
          contractName: 'Token2Contract',
        }),
      ] as [UpsertableTokenMetaRecord, UpsertableTokenMetaRecord]

      await repository.upsertMany(updatedAndNewRecords)

      const finalRecords = await repository.getAll()
      expect(finalRecords).toHaveLength(2)
      expect(finalRecords[0]).toEqual(mockOutput(updatedAndNewRecords[0]))
      expect(finalRecords[1]).toEqual(mockOutput(updatedAndNewRecords[1]))
    })
  })
})

function mock({
  tokenId,
  source,
  externalId,
  name,
  symbol,
  decimals,
  logoUrl,
  contractName,
}: UpsertableTokenMetaRecord): UpsertableTokenMetaRecord {
  return {
    tokenId,
    source,
    externalId,
    name,
    symbol,
    decimals,
    logoUrl,
    contractName,
  }
}

function mockOutput(
  input: UpsertableTokenMetaRecord,
): UpsertableTokenMetaRecord & {
  id: string
  createdAt: Date
  updatedAt: Date
} {
  return {
    ...input,
    id: expect.a(String),
    createdAt: expect.a(Date),
    updatedAt: expect.a(Date),
  }
}
