import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { GrissiniIcon } from './GrissiniIcon'

// Grissini sticks show sentiment by colour only, and their tooltip is not
// server-rendered. We render the icon to static markup and check that the
// risks are spelled out in visually hidden text.
describe(GrissiniIcon.name, () => {
  it('spells out every risk with its sentiment', () => {
    const html = renderToStaticMarkup(
      createElement(GrissiniIcon, {
        values: [
          { name: 'Relayer failure', value: 'None', sentiment: 'bad' },
          { name: 'Upgradeability', value: 'Immutable', sentiment: 'good' },
          { name: 'Economic security', value: 'Staked', sentiment: 'warning' },
        ],
      }),
    )

    expect(html).toInclude(
      '<span class="sr-only">Relayer failure: None, bad; ' +
        'Upgradeability: Immutable, good; ' +
        'Economic security: Staked, warning</span>',
    )
  })

  it('says there is no bridge instead of describing placeholder sticks', () => {
    const html = renderToStaticMarkup(
      createElement(GrissiniIcon, { values: [] }),
    )

    expect(html).toInclude('<span class="sr-only">No bridge</span>')
    expect(html).not.toInclude('under review')
  })
})
