import { expect } from 'earl'
import { PositiveInteger } from './types'

describe('PositiveInteger', () => {
  it('takes a count of one or more', async () => {
    expect(await PositiveInteger.from('1')).toEqual(1)
    expect(await PositiveInteger.from('12')).toEqual(12)
  })

  it('rejects zero, a negative, a fraction and a word', async () => {
    for (const [raw, shown] of [
      ['0', '0'],
      ['-2', '-2'],
      ['1.5', '1.5'],
    ]) {
      await expect(PositiveInteger.from(raw ?? '')).toBeRejectedWith(
        `Expected a positive integer, got ${shown}`,
      )
    }
    await expect(PositiveInteger.from('three')).toBeRejectedWith('Not a number')
  })
})
