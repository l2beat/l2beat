import { expect } from 'earl'
import { getLinkHeader } from './LlmsLinkHeaderMiddleware'

// Method: compare the header string for a page with and without a markdown
// alternate against the link relations named in the llms.txt spec.
describe(getLinkHeader.name, () => {
  it('points every page at llms.txt', () => {
    expect(getLinkHeader('/faq')).toEqual(
      '<https://l2beat.com/llms.txt>; rel="describedby"',
    )
  })

  it('adds the markdown alternate where one exists', () => {
    expect(getLinkHeader('/layer2s/summary')).toEqual(
      '<https://l2beat.com/layer2s/summary.md>; rel="alternate"; type="text/markdown", <https://l2beat.com/llms.txt>; rel="describedby"',
    )
  })

  it('finds the alternate for every path Express routes to the page', () => {
    expect(getLinkHeader('/Layer2s/Summary/')).toEqual(
      getLinkHeader('/layer2s/summary'),
    )
  })
})
