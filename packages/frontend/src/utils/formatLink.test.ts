import { expect } from 'earl'

import { formatLink } from './formatLink'

describe('formatLink', () => {
  it('should remove https:// from the beginning of the link', () => {
    expect(formatLink('https://example.com')).toEqual('example.com')
  })

  it('should remove http:// from the beginning of the link', () => {
    expect(formatLink('http://example.com')).toEqual('example.com')
  })

  it('should remove trailing slash from the link', () => {
    expect(formatLink('example.com/')).toEqual('example.com')
  })
})
