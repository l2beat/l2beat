import { expect } from 'earl'
import {
  absolutizeLinks,
  bulletList,
  formatChange,
  markCritical,
  numberedList,
  subsection,
  table,
} from './markdown'

// Method: feed small hand-written markdown snippets and compare with the
// expected text literally.
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
  const PAGE_URL = 'https://l2beat.com/scaling/projects/x'

  it('prefixes site paths in links and images with the origin', () => {
    expect(
      absolutizeLinks(
        'See [best practices](/publications/x) and ![diagram](/images/y.png).',
        PAGE_URL,
      ),
    ).toEqual(
      'See [best practices](https://l2beat.com/publications/x) and ![diagram](https://l2beat.com/images/y.png).',
    )
  })

  it('leaves absolute and protocol-relative URLs alone', () => {
    const text = '[a](https://example.com/x) [b](//cdn.example.com/y)'
    expect(absolutizeLinks(text, PAGE_URL)).toEqual(text)
  })

  it('resolves fragment and query links against the HTML page', () => {
    expect(
      absolutizeLinks(
        'See [permissions](#permissions), [update](?update=1).',
        PAGE_URL,
      ),
    ).toEqual(
      'See [permissions](https://l2beat.com/scaling/projects/x#permissions), [update](https://l2beat.com/scaling/projects/x?update=1).',
    )
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
