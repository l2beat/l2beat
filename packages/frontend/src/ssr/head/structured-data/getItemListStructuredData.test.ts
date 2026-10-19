import { expect } from 'earl'
import { getItemListStructuredData } from './getItemListStructuredData'

// Feeds the page getMetadata would resolve for /privacy/summary plus two
// listed projects, and compares against the literal ItemList a crawler sees.
describe(getItemListStructuredData.name, () => {
  it('lists the projects by name and production URL, in page order', () => {
    const list = getItemListStructuredData(
      {
        url: 'https://l2beat.com/privacy/summary',
        description: 'Privacy description',
        image: 'https://l2beat.com/og.png',
      },
      {
        name: 'Privacy protocol reviews',
        items: [
          { name: 'Tornado Cash', path: '/privacy/projects/tornado-cash' },
          { name: 'Railgun', path: '/privacy/projects/railgun' },
        ],
      },
    )

    expect(list).toEqual({
      '@type': 'ItemList',
      '@id': 'https://l2beat.com/privacy/summary#list',
      name: 'Privacy protocol reviews',
      url: 'https://l2beat.com/privacy/summary',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Tornado Cash',
          url: 'https://l2beat.com/privacy/projects/tornado-cash',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Railgun',
          url: 'https://l2beat.com/privacy/projects/railgun',
        },
      ],
    })
  })
})
