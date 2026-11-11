import { expect } from 'earl'
import { getWebPageStructuredData } from './getWebPageStructuredData'

// Feeds the page getMetadata would resolve for a privacy project and compares
// against the literal WebPage a crawler sees.
describe(getWebPageStructuredData.name, () => {
  it('describes the page with its meta description and names the project', () => {
    const webPage = getWebPageStructuredData(
      {
        url: 'https://ethbeat.org/privacy/projects/tornado-cash',
        description: 'Tornado Cash is a privacy pool.',
        image: 'https://ethbeat.org/og.png',
      },
      { name: 'Tornado Cash privacy review', about: 'Tornado Cash' },
    )

    expect(webPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://ethbeat.org/privacy/projects/tornado-cash',
      url: 'https://ethbeat.org/privacy/projects/tornado-cash',
      name: 'Tornado Cash privacy review',
      description: 'Tornado Cash is a privacy pool.',
      about: { '@type': 'Thing', name: 'Tornado Cash' },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://ethbeat.org/#organization',
        name: 'ETHBEAT',
        url: 'https://ethbeat.org',
        logo: 'https://ethbeat.org/logo.png',
      },
    })
  })
})
