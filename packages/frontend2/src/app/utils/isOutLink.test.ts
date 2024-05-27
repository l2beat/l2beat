import { expect } from 'earl'

import { isOutLink } from './isOutLink'

describe(isOutLink.name, () => {
  it('returns true for out links', () => {
    expect(isOutLink('https://example.com')).toEqual(true)
    expect(isOutLink('http://example.com')).toEqual(true)
  })

  it('returns false for relative links', () => {
    expect(isOutLink('/example')).toEqual(false)
  })
})
