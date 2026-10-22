import { expect } from 'earl'
import { getWebPageStructuredData } from './getWebPageStructuredData'

// Feeds the page getMetadata would resolve for a privacy project and compares
// against the literal WebPage a crawler sees.
describe(getWebPageStructuredData.name, () => {
  it('describes the page with its meta description and names the project', () => {
    const webPage = getWebPageStructuredData(
      {
        url: 'https://l2beat.com/privacy/projects/tornado-cash',
        description: 'Tornado Cash is a privacy pool.',
        image: 'https://l2beat.com/og.png',
      },
      { name: 'Tornado Cash privacy review', about: 'Tornado Cash' },
    )

    expect(webPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://l2beat.com/privacy/projects/tornado-cash',
      url: 'https://l2beat.com/privacy/projects/tornado-cash',
      name: 'Tornado Cash privacy review',
      description: 'Tornado Cash is a privacy pool.',
      about: { '@type': 'Thing', name: 'Tornado Cash' },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://l2beat.com/#organization',
        name: 'L2BEAT',
        url: 'https://l2beat.com',
        logo: 'https://l2beat.com/logo.png',
      },
    })
  })
})
