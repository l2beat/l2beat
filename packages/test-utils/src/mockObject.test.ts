import { describe, expect, it, vi } from 'vitest'
import { mockObject } from './mockObject.js'

interface Repository {
  name: string
  getById(id: number): Promise<string | undefined>
  deleteAll(): number
}

describe(mockObject.name, () => {
  it('exposes overridden functions as vitest mocks', async () => {
    const repository = mockObject<Repository>({
      getById: async (id) => `row-${id}`,
    })

    expect(await repository.getById(1)).toEqual('row-1')
    expect(repository.getById).toHaveBeenCalledExactlyOnceWith(1)
    expect(repository.getById.mock.calls).toStrictEqual([[1]])
  })

  it('passes non-function members through untouched', () => {
    const repository = mockObject<Repository>({ name: 'blocks' })

    expect(repository.name).toEqual('blocks')
  })

  it('keeps a mock passed in as an override, so its configuration survives', () => {
    const deleteAll = vi.fn().mockReturnValue(7)
    const repository = mockObject<Repository>({ deleteAll })

    expect(repository.deleteAll()).toEqual(7)
    expect(repository.deleteAll).toBe(deleteAll)
  })

  it('throws when a member was not mocked, to surface typos at the call site', () => {
    const repository = mockObject<Repository>({ name: 'blocks' })

    expect(() => repository.deleteAll()).toThrowWithMessage(
      TypeError,
      'Cannot read .deleteAll - mockObject was created without it.',
    )
  })

  it('can stand in for the mocked type', () => {
    const repository: Repository = mockObject<Repository>({
      deleteAll: () => 0,
    })

    expect(repository.deleteAll()).toEqual(0)
  })
})
