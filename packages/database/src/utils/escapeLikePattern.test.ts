import { describe, expect, it } from 'vitest'
import { escapeLikePattern } from './escapeLikePattern'

describe(escapeLikePattern.name, () => {
  it('escapes LIKE wildcards and backslashes', () => {
    expect(escapeLikePattern('100%_done\\now')).toStrictEqual(
      '100\\%\\_done\\\\now',
    )
  })

  it('leaves plain text unchanged', () => {
    expect(escapeLikePattern('USDC ethereum 0xabc')).toStrictEqual(
      'USDC ethereum 0xabc',
    )
  })
})
