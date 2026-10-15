import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { createProjectDataCheck } from './createProjectDataCheck'

const FROM = UnixTime(1_700_000_000)

describe(createProjectDataCheck.name, () => {
  it('asks for every candidate in one query', async () => {
    const getKeysWithData = mockFn().resolvesTo(['a'])
    const hasData = createProjectDataCheck({
      name: 'test',
      getCandidates: async () => ['a', 'b'],
      getKeysWithData,
    })

    expect(await hasData('a', FROM)).toEqual(true)
    expect(await hasData('b', FROM)).toEqual(false)
    expect(getKeysWithData).toHaveBeenCalledWith(['a', 'b'], FROM)
  })

  it('asks for a non-candidate alone', async () => {
    const getKeysWithData = mockFn(
      async (keys: string[], _fromInclusive: UnixTime | undefined) =>
        keys.filter((key) => key === 'c'),
    )
    const hasData = createProjectDataCheck({
      name: 'test',
      getCandidates: async () => ['a'],
      getKeysWithData,
    })

    expect(await hasData('c', undefined)).toEqual(true)
    expect(getKeysWithData).toHaveBeenLastCalledWith(['c'], undefined)
  })
})
