import { expect } from 'earl'
import { NonNegativeInteger, PositiveInteger } from './types'

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

describe('NonNegativeInteger', () => {
  it('takes zero and up', async () => {
    expect(await NonNegativeInteger.from('0')).toEqual(0)
    expect(await NonNegativeInteger.from('3')).toEqual(3)
  })

  it('rejects a negative, a fraction and a word', async () => {
    for (const raw of ['-1', '0.5']) {
      await expect(NonNegativeInteger.from(raw)).toBeRejectedWith(
        'Expected a non-negative integer',
      )
    }
    await expect(NonNegativeInteger.from('two')).toBeRejectedWith(
      'Not a number',
    )
  })
})
