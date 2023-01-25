import { expect } from 'earljs'

import { binSearch } from './binSearch'

describe(binSearch.name, () => {
  const start = 0
  const end = 17
  it('works properly', async () => {
    for (let i = 0; i < end; i++) {
      const check = async (x: number) => x <= i
      expect(await binSearch(start, end, check)).toEqual(i + 1)
    }
  })
})
