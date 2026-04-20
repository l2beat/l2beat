import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type TokenFactInputRecord,
  TokenFactInputRepository,
} from './TokenFactInputRepository'

describeDatabase(TokenFactInputRepository.name, (db) => {
  const repository = db.tokenFactInput

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(TokenFactInputRepository.prototype.insert.name, () => {
    it('inserts a record with JSON context', async () => {
      const record = tokenFactInput({
        name: 'isWrapped',
        arguments: '{"token":"ETH"}',
        context: {
          chain: 'ethereum',
          nested: { value: 1 },
        },
      })

      await repository.insert(record)

      const result = await repository.getAll()

      expect(result).toHaveLength(1)
      expect(result[0]!.id).toBeGreaterThan(0)
      expect(withoutId(result[0]!)).toEqual(record)
    })

    it('accepts null context', async () => {
      const record = tokenFactInput({
        name: 'hasNoContext',
        context: null,
      })

      await repository.insert(record)

      const result = await repository.getAll()

      expect(result).toHaveLength(1)
      expect(withoutId(result[0]!)).toEqual(record)
    })
  })

  describe(TokenFactInputRepository.prototype.insertMany.name, () => {
    it('inserts multiple records', async () => {
      const records = [
        tokenFactInput({
          name: 'match',
          arguments: '{"a":1}',
          context: { source: 'manual' },
        }),
        tokenFactInput({
          name: 'match',
          arguments: '{"a":2}',
          context: null,
        }),
        tokenFactInput({
          name: 'other',
          arguments: '{"a":3}',
          context: ['ethereum', 'arbitrum'],
        }),
      ]

      await repository.insertMany(records)

      const result = await repository.getAll()

      expect(result).toHaveLength(3)
      expect(result.map(withoutId)).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      await repository.insertMany([])

      const result = await repository.getAll()

      expect(result).toEqual([])
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = Array.from({ length: 1500 }, (_, i) =>
        tokenFactInput({
          name: `fact-${i % 3}`,
          arguments: `{"index":${i}}`,
          context: { index: i },
        }),
      )

      await repository.insertMany(records)

      const result = await repository.getAll()

      expect(result).toHaveLength(1500)
      expect(result.map(withoutId)).toEqualUnsorted(records)
    })
  })

  describe(TokenFactInputRepository.prototype.getAll.name, () => {
    it('returns empty array when no records exist', async () => {
      const result = await repository.getAll()

      expect(result).toEqual([])
    })
  })

  describe(TokenFactInputRepository.prototype.getByName.name, () => {
    it('returns only records with the matching name', async () => {
      const matchingRecords = [
        tokenFactInput({
          name: 'same-name',
          arguments: '{"step":1}',
          context: { chain: 'ethereum' },
        }),
        tokenFactInput({
          name: 'same-name',
          arguments: '{"step":2}',
          context: { chain: 'arbitrum' },
        }),
      ]
      const otherRecord = tokenFactInput({
        name: 'different-name',
        arguments: '{"step":3}',
        context: { chain: 'optimism' },
      })

      await repository.insertMany([...matchingRecords, otherRecord])

      const result = await repository.getByName('same-name')

      expect(result).toHaveLength(2)
      expect(result.map(withoutId)).toEqualUnsorted(matchingRecords)
    })
  })

  describe(TokenFactInputRepository.prototype.deleteAll.name, () => {
    it('deletes all rows and returns the number of deleted rows', async () => {
      await repository.insertMany([
        tokenFactInput({ name: 'a' }),
        tokenFactInput({ name: 'b' }),
      ])

      const deleted = await repository.deleteAll()

      expect(deleted).toEqual(2)
      expect(await repository.getAll()).toEqual([])
    })
  })
})

function tokenFactInput(
  record: Partial<Omit<TokenFactInputRecord, 'id'>> = {},
): Omit<TokenFactInputRecord, 'id'> {
  return {
    name: 'isCanonical',
    arguments: '{"token":"USDC"}',
    context: { reason: 'default' },
    ...record,
  }
}

function withoutId(
  record: TokenFactInputRecord,
): Omit<TokenFactInputRecord, 'id'> {
  return {
    name: record.name,
    arguments: record.arguments,
    context: record.context,
  }
}
