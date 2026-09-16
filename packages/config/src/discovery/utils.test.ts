import { describe, expect, it } from 'vitest'
import { trimTrailingDots } from './utils'

describe(trimTrailingDots.name, () => {
  it('should remove trailing dots', () => {
    const description = 'Some description...'
    const trimmed = trimTrailingDots(description)
    expect(trimmed).toStrictEqual('Some description')
  })

  it('should not remove trailing dots if there are no dots', () => {
    const description = 'Some description'
    const trimmed = trimTrailingDots(description)
    expect(trimmed).toStrictEqual(description)
  })
})
