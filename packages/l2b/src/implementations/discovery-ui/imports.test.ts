import { DiffHistoryParser } from '@l2beat/shared-pure'
import { expect } from 'earl'

describe('discovery-ui imports', () => {
  it('re-exports DiffHistoryParser from @l2beat/shared-pure', () => {
    const parser = new DiffHistoryParser()
    expect(parser).toBeA(DiffHistoryParser)
  })
})
