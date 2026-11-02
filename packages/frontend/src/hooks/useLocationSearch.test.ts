import { expect } from 'earl'
import { getSsrRequestSearch } from './useLocationSearch'

// Method: set the URL ServerEntry hands to the render and compare with what
// `location.search` gives for the same URL in a browser, since hydration
// needs the two to match.
describe(getSsrRequestSearch.name, () => {
  let previousSsrUrl: string

  beforeEach(() => {
    previousSsrUrl = globalThis.__FIX_SSR_URL__
  })

  afterEach(() => {
    globalThis.__FIX_SSR_URL__ = previousSsrUrl
  })

  for (const url of [
    '/layer2s/summary',
    '/layer2s/summary?',
    '/layer2s/summary?tab=others',
    // A filter value may hold a raw `?`; browsers send quotes encoded.
    '/layer2s/summary?filters=%7B%22stack%22:%7B%22values%22:[%22a?b%22]%7D%7D',
  ]) {
    it(`matches location.search for ${url}`, () => {
      globalThis.__FIX_SSR_URL__ = url

      expect(getSsrRequestSearch()).toEqual(
        new URL(url, 'https://l2beat.com').search,
      )
    })
  }
})
