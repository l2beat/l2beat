import { expect } from 'earl'
import { getItemListStructuredData } from './getItemListStructuredData'

// Feeds the page getMetadata would resolve for /privacy/summary plus two
// listed projects, and compares against the literal ItemList a crawler sees.
describe(getItemListStructuredData.name, () => {
  it('lists the projects by name and production URL, in page order', () => {
    const list = getItemListStructuredData(
      {
        url: 'https://ethbeat.org/privacy/summary',
        description: 'Privacy description',
        image: 'https://ethbeat.org/og.png',
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
      '@id': 'https://ethbeat.org/privacy/summary#list',
      name: 'Privacy protocol reviews',
      url: 'https://ethbeat.org/privacy/summary',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Tornado Cash',
          url: 'https://ethbeat.org/privacy/projects/tornado-cash',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Railgun',
          url: 'https://ethbeat.org/privacy/projects/railgun',
        },
      ],
    })
  })
})
