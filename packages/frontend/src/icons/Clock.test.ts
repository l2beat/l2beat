import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ClockIcon } from './Clock'

// Rendered to static markup because the role/aria-hidden split is what
// assistive technology reads from the server HTML.
describe(ClockIcon.name, () => {
  it('is an image when labelled', () => {
    const html = renderToStaticMarkup(
      createElement(ClockIcon, { 'aria-label': 'Data not synced' }),
    )

    expect(html).toInclude('role="img"')
    expect(html).not.toInclude('aria-hidden')
  })

  it('is hidden decoration when unlabelled', () => {
    const html = renderToStaticMarkup(createElement(ClockIcon))

    expect(html).toInclude('aria-hidden="true"')
    expect(html).not.toInclude('role="img"')
  })
})
