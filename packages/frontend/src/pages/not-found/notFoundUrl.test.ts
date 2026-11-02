import { expect } from 'earl'
import { env } from '~/env'
import { getSearchQueryFromUrl, getSectionIndexFromUrl } from './notFoundUrl'

// Method: feed the URLs a 404 is rendered for (req.originalUrl, so with a
// query string) and compare against what a visitor would type or click.
describe(getSearchQueryFromUrl.name, () => {
  it('humanizes the last path segment', () => {
    expect(getSearchQueryFromUrl('/layer2s/projects/arbitrun')).toEqual(
      'arbitrun',
    )
    expect(getSearchQueryFromUrl('/layer2s/projects/zksync-era/')).toEqual(
      'zksync era',
    )
  })

  it('ignores the query string, encoding and file extension', () => {
    expect(
      getSearchQueryFromUrl('/interop/protocols/lay%20er_zero.md?tab=x'),
    ).toEqual('lay er zero')
  })

  it('keeps a segment that is not valid percent-encoding', () => {
    expect(getSearchQueryFromUrl('/foo/100%')).toEqual('100%')
  })

  it('is empty for the root', () => {
    expect(getSearchQueryFromUrl('/')).toEqual('')
  })
})

describe(getSectionIndexFromUrl.name, () => {
  const originalTokensPage = env.CLIENT_SIDE_TOKENS_PAGE

  afterEach(() => {
    env.CLIENT_SIDE_TOKENS_PAGE = originalTokensPage
  })

  it('links the index of the section the URL is in', () => {
    expect(getSectionIndexFromUrl('/layer2s/projects/arbitrun')).toEqual({
      name: 'Layer 2 summary',
      href: '/layer2s/summary',
    })
    expect(getSectionIndexFromUrl('/interop/protocols/x')?.href).toEqual(
      '/interop/summary',
    )
  })

  it('links nothing for a section without an index', () => {
    expect(getSectionIndexFromUrl('/ecosystems/x')).toEqual(undefined)
    expect(getSectionIndexFromUrl('/nope/x')).toEqual(undefined)
  })

  it('links nothing for a section that is switched off', () => {
    env.CLIENT_SIDE_TOKENS_PAGE = false

    expect(getSectionIndexFromUrl('/tokens/x')).toEqual(undefined)
  })
})
