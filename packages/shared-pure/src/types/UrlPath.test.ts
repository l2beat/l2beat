import { expect } from 'earl'

import { UrlPath } from './UrlPath'

describe('UrlPath', () => {
  it('accepts normal link', () => {
    const result = UrlPath.safeParse('https://www.google.com')
    expect(result.success).toBeTruthy()
  })

  it('accepts link with path', () => {
    const result = UrlPath.safeParse('https://www.google.com/search#')
    expect(result.success).toBeTruthy()
  })

  it('accepts link with query', () => {
    const result = UrlPath.safeParse('https://www.google.com/search?q=hello')
    expect(result.success).toBeTruthy()
  })

  it('accepts link with query and path', () => {
    const result = UrlPath.safeParse('https://www.google.com/search?q=hello#')
    expect(result.success).toBeTruthy()
  })

  it('does not accept link with spaces', () => {
    const result = UrlPath.safeParse(
      'https://www.google.com/search?q=hello world',
    )
    expect(result.success).toBeFalsy()
  })

  it('does not accept random string', () => {
    const result = UrlPath.safeParse('hello world')
    expect(result.success).toBeFalsy()
  })
})
