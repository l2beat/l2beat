import { expect } from 'earl'
import { assessCount } from './assessCount'

describe(assessCount.name, () => {
  it('returns the count unchanged without an adjustment', () => {
    expect(assessCount(undefined)(10, 5)).toEqual(10)
  })

  it('subtracts one for SubtractOne', () => {
    expect(assessCount({ type: 'SubtractOne' })(10, 5)).toEqual(9)
  })

  it('subtracts one from the given block for SubtractOneSinceBlock', () => {
    const assess = assessCount({
      type: 'SubtractOneSinceBlock',
      blockNumber: 5,
    })
    expect(assess(10, 4)).toEqual(10)
    expect(assess(10, 5)).toEqual(9)
  })

  it('applies the last step at or below the block for SubtractSinceBlocks', () => {
    const assess = assessCount({
      type: 'SubtractSinceBlocks',
      steps: [
        { blockNumber: 100, count: 2 },
        { blockNumber: 1, count: 1 },
      ],
    })
    expect(assess(10, 0)).toEqual(10)
    expect(assess(10, 1)).toEqual(9)
    expect(assess(10, 99)).toEqual(9)
    expect(assess(10, 100)).toEqual(8)
    expect(assess(10, 1_000_000)).toEqual(8)
  })
})
