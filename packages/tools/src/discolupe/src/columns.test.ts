import { expect } from 'earl'
import { AVAILABLE_COLUMNS } from './columns'

describe('columns', () => {
  it('each column has a unique id', () => {
    const values = Object.values(AVAILABLE_COLUMNS).map((c) => c.id)
    const unique = [...new Set(values)]
    expect(values).toEqual(unique)
  })
})
