import { expect } from 'earl'
import {
  absolutizeLinks,
  bulletList,
  formatChange,
  markCritical,
  nestHeadings,
  numberedList,
  subsection,
  table,
  tidyMarkdown,
} from './markdown'

// Method: feed small hand-written markdown snippets and compare with the
// expected text literally.
describe(nestHeadings.name, () => {
  it('moves the shallowest heading to the given level, keeping the hierarchy', () => {
    expect(nestHeadings('## Architecture\n\nText\n\n### Nodes', 4)).toEqual(
      '#### Architecture\n\nText\n\n##### Nodes',
    )
  })

  it('leaves text that is already deep enough or has no headings', () => {
    expect(nestHeadings('#### Deep', 3)).toEqual('#### Deep')
    expect(nestHeadings('Plain #hashtag text', 3)).toEqual(
      'Plain #hashtag text',
    )
  })

  it('does not treat # lines inside code fences as headings', () => {
    expect(nestHeadings('# Title\n\n```\n# comment\n```', 3)).toEqual(
      '### Title\n\n```\n# comment\n```',
    )
  })

  it('stops at level 6, the deepest markdown heading', () => {
    expect(nestHeadings('# One\n\n## Two', 6)).toEqual(
      '###### One\n\n###### Two',
    )
  })
})

describe(subsection.name, () => {
  it('heads a non-empty body', () => {
    expect(subsection(3, 'Roles', 'Body')).toEqual('### Roles\n\nBody')
  })

  it('drops the heading when there is no body to head', () => {
    expect(subsection(3, 'Roles', '')).toEqual('')
    expect(subsection(3, 'Roles', undefined)).toEqual('')
  })
})

describe(absolutizeLinks.name, () => {
  it('prefixes site paths in links and images with the origin', () => {
    expect(
      absolutizeLinks(
        'See [best practices](/publications/x) and ![diagram](/images/y.png).',
        'https://l2beat.com',
      ),
    ).toEqual(
      'See [best practices](https://l2beat.com/publications/x) and ![diagram](https://l2beat.com/images/y.png).',
    )
  })

  it('leaves absolute and protocol-relative URLs alone', () => {
    const text = '[a](https://example.com/x) [b](//cdn.example.com/y)'
    expect(absolutizeLinks(text, 'https://l2beat.com')).toEqual(text)
  })
})

describe(markCritical.name, () => {
  it('puts the marker before the closing punctuation', () => {
    expect(markCritical('Funds can be stolen.', true)).toEqual(
      'Funds can be stolen (CRITICAL).',
    )
  })

  it('puts the marker before a trailing comma, colon or semicolon too', () => {
    expect(markCritical('There is no delay on code upgrades,', true)).toEqual(
      'There is no delay on code upgrades (CRITICAL),',
    )
    expect(markCritical('Funds can be stolen if:', true)).toEqual(
      'Funds can be stolen if (CRITICAL):',
    )
  })

  it('appends the marker to text without closing punctuation', () => {
    expect(markCritical('Program hashes are unverified', true)).toEqual(
      'Program hashes are unverified (CRITICAL)',
    )
  })

  it('leaves non-critical text alone', () => {
    expect(markCritical('Funds can be stolen.', false)).toEqual(
      'Funds can be stolen.',
    )
  })
})

describe(table.name, () => {
  it('escapes pipes so a cell cannot split into two columns', () => {
    expect(table(['Asset', 'Value'], [['A|B', '$1']])).toEqual(
      '| Asset | Value |\n| --- | --- |\n| A\\|B | $1 |',
    )
  })

  it('joins the lines of a cell so it cannot split into two rows', () => {
    expect(table(['Asset', 'Value'], [['A\nB', '$1']])).toEqual(
      '| Asset | Value |\n| --- | --- |\n| A B | $1 |',
    )
  })
})

describe(formatChange.name, () => {
  it('signs the change as the HTML arrow does', () => {
    expect(formatChange(0.025, '7D')).toEqual(
      '+2.50% compared to seven days ago',
    )
    expect(formatChange(-0.03, 'last7d')).toEqual(
      '-3.00% compared to the previous seven days',
    )
  })

  it('leaves a change too small to show unsigned', () => {
    expect(formatChange(-0.00001, '7D')).toEqual(
      '0.00% compared to seven days ago',
    )
    expect(formatChange(0.00001, '7D')).toEqual(
      '0.00% compared to seven days ago',
    )
  })

  it('spells out the cap the HTML shows for huge changes', () => {
    expect(formatChange(25, '7D')).toEqual(
      'more than +1K% compared to seven days ago',
    )
  })
})

describe(bulletList.name, () => {
  it('indents the continuation of a multi-paragraph item so it stays in the list', () => {
    expect(bulletList(['First.\n\nMore on first.', 'Second.'])).toEqual(
      '- First.\n\n  More on first.\n- Second.',
    )
  })

  it('nests a list inside an item', () => {
    expect(bulletList(['Parent:\n- child'])).toEqual('- Parent:\n  - child')
  })
})

describe(numberedList.name, () => {
  it('indents continuation lines to the item text, past the number', () => {
    expect(numberedList(['First.\n\nMore.'], 9)).toEqual(
      '9. First.\n\n   More.',
    )
    expect(numberedList(['Tenth.\nMore.'], 10)).toEqual('10. Tenth.\n    More.')
  })
})

describe(tidyMarkdown.name, () => {
  const PAGE_URL = 'https://l2beat.com/scaling/projects/x'

  it('resolves fragment links against the HTML page', () => {
    expect(tidyMarkdown('See [permissions](#permissions).', PAGE_URL)).toEqual(
      'See [permissions](https://l2beat.com/scaling/projects/x#permissions).',
    )
  })

  it('turns br tags, raw or HTML-escaped, into line breaks', () => {
    expect(
      tidyMarkdown(
        '1. a\n<br>\n## Next\n\nOne.<br />Two. &lt;br/&gt; Three.',
        PAGE_URL,
      ),
    ).toEqual('1. a\n\n## Next\n\nOne.\nTwo.\nThree.')
  })

  it('keeps table rows on one line when a cell has a br tag', () => {
    expect(tidyMarkdown('| a<br>b | c |', PAGE_URL)).toEqual('| a b | c |')
  })

  it('trims trailing spaces and collapses blank-line runs', () => {
    expect(tidyMarkdown('One.  \n\n\n\nTwo. ', PAGE_URL)).toEqual(
      'One.\n\nTwo.',
    )
  })

  it('collapses runs of spaces in prose, but not in inline code or tables', () => {
    expect(
      tidyMarkdown('Too  many   spaces in `a  b`.\n| x  | y |', PAGE_URL),
    ).toEqual('Too many spaces in `a  b`.\n| x  | y |')
  })

  it('uses one bullet marker', () => {
    expect(tidyMarkdown('* one\n  * nested\n**bold**', PAGE_URL)).toEqual(
      '- one\n  - nested\n**bold**',
    )
  })

  it('aligns wrapped lines of template-literal text with the text they continue', () => {
    expect(
      tidyMarkdown(
        'It delivers\n      limitless scale.\n\n- An item\n      wrapped.\n    - nested',
        PAGE_URL,
      ),
    ).toEqual(
      'It delivers\nlimitless scale.\n\n- An item\n  wrapped.\n    - nested',
    )
  })

  it('keeps indented code after a blank line', () => {
    const code = 'Run:\n\n    make  build\n    make  test'
    expect(tidyMarkdown(code, PAGE_URL)).toEqual(code)
  })

  it('leaves fenced code verbatim', () => {
    const code =
      '```\n* not a bullet\n\n\n\nx  =  1 <br> [a](#b)\n      indented\n```'
    expect(tidyMarkdown(code, PAGE_URL)).toEqual(code)
  })
})
