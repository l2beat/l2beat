import { expect } from 'earl'
import { escapeLikePattern } from './escapeLikePattern'

describe(escapeLikePattern.name, () => {
  it('escapes LIKE wildcards and backslashes', () => {
    expect(escapeLikePattern('100%_done\\now')).toEqual('100\\%\\_done\\\\now')
  })

  it('leaves plain text unchanged', () => {
    expect(escapeLikePattern('USDC ethereum 0xabc')).toEqual(
      'USDC ethereum 0xabc',
    )
  })
})
