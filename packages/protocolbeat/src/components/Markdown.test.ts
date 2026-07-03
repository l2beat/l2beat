import { expect } from 'earl'
import { renderMarkdown } from './Markdown'

describe('renderMarkdown', () => {
  it('escapes raw HTML when HTML is disabled', () => {
    const rendered = renderMarkdown(
      'hello <img src=x onerror=alert(1)> **world**',
      { allowHtml: false },
    )

    expect(rendered).toEqual(
      '<p>hello &lt;img src=x onerror=alert(1)&gt; <strong>world</strong></p>\n',
    )
  })
})
