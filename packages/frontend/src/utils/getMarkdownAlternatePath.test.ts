import { expect } from 'earl'
import { getMarkdownAlternatePath } from './getMarkdownAlternatePath'

// Method: resolve page paths the way the Link header, the <head> link and
// the project links bar do, for every kind of registered page (a fixed list
// page, a project page pattern, a pattern with optional segments) and for
// paths that must not resolve.
describe(getMarkdownAlternatePath.name, () => {
  it('resolves a list page to its .md URL', () => {
    expect(getMarkdownAlternatePath('/layer2s/summary')).toEqual(
      '/layer2s/summary.md',
    )
  })

  it('resolves any project of a registered page kind', () => {
    expect(getMarkdownAlternatePath('/layer2s/projects/arbitrum')).toEqual(
      '/layer2s/projects/arbitrum.md',
    )
    expect(
      getMarkdownAlternatePath(
        '/data-availability/projects/celestia/blobstream',
      ),
    ).toEqual('/data-availability/projects/celestia/blobstream.md')
  })

  it('resolves every path Express routes to the page', () => {
    expect(getMarkdownAlternatePath('/Layer2s/Projects/Arbitrum/')).toEqual(
      '/layer2s/projects/arbitrum.md',
    )
  })

  it('resolves a page in every shape its optional segments allow', () => {
    for (const path of [
      '/interop/tokens/usdc01',
      '/interop/tokens/usdc01/usdc',
      '/interop/tokens/usdc01/circle/usdc',
    ]) {
      expect(getMarkdownAlternatePath(path)).toEqual(`${path}.md`)
    }
  })

  it('has no alternate for pages without a markdown version', () => {
    for (const path of [
      '/faq',
      '/layer2s/projects',
      '/layer2s/projects/arbitrum/tvs-breakdown',
      '/interop/tokens/usdc01/circle/usdc/extra',
    ]) {
      expect(getMarkdownAlternatePath(path)).toEqual(undefined)
    }
  })

  // A quadratic trailing-slash trim takes ~14s on this input, so mocha's 2s
  // timeout fails the test without a flaky timing assertion.
  it('resolves a request path of many slashes in linear time', () => {
    expect(getMarkdownAlternatePath(`${'/'.repeat(100_000)}x`)).toEqual(
      undefined,
    )
  })

  it('has no alternate for the markdown version itself', () => {
    expect(getMarkdownAlternatePath('/layer2s/projects/arbitrum.md')).toEqual(
      undefined,
    )
  })
})
