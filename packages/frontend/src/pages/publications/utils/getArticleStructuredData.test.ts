import { expect } from 'earl'
import { getArticleStructuredData } from './getArticleStructuredData'

// Feeds the page getMetadata would resolve plus a hand-written post, and
// compares against the literal Article a crawler should see.
describe(getArticleStructuredData.name, () => {
  const page = {
    url: 'https://ethbeat.org/publications/governance-review-1',
    description:
      'ETHBEAT provides weekly updates on governance in concise articles.',
    image:
      'https://ethbeat.org/meta-images/publications/governance-review-1.png',
  }
  const post = {
    headline: 'Governance Review #01',
    publishedOn: new Date('2024-01-19T00:00:00Z'),
  }
  const l2beat = {
    '@type': 'Organization' as const,
    '@id': 'https://ethbeat.org/#organization',
    name: 'ETHBEAT',
    url: 'https://ethbeat.org',
    logo: 'https://ethbeat.org/logo.png',
  }

  it('describes a post as an Article by its author', () => {
    const article = getArticleStructuredData(page, {
      ...post,
      author: {
        firstName: 'Anastassis',
        lastName: 'Oikonomopoulos',
        role: 'Governance Representative',
      },
    })

    expect(article).toEqual({
      '@type': 'Article',
      '@id': 'https://ethbeat.org/publications/governance-review-1',
      url: 'https://ethbeat.org/publications/governance-review-1',
      mainEntityOfPage: 'https://ethbeat.org/publications/governance-review-1',
      headline: 'Governance Review #01',
      description:
        'ETHBEAT provides weekly updates on governance in concise articles.',
      image:
        'https://ethbeat.org/meta-images/publications/governance-review-1.png',
      datePublished: '2024-01-19',
      author: {
        '@type': 'Person',
        name: 'Anastassis Oikonomopoulos',
        jobTitle: 'Governance Representative',
      },
      publisher: l2beat,
    })
  })

  it('leaves out the job title of an author without a role', () => {
    const article = getArticleStructuredData(page, {
      ...post,
      author: { firstName: 'Ada', lastName: 'Lovelace', role: undefined },
    })

    expect(article.author).toEqual({ '@type': 'Person', name: 'Ada Lovelace' })
  })

  it('credits ETHBEAT for a post without a single author', () => {
    const article = getArticleStructuredData(page, post)

    expect(article.author).toEqual(l2beat)
  })

  it('prefers the summary of the post over the page description', () => {
    const article = getArticleStructuredData(page, {
      ...post,
      description: 'Discover the key highlights from July.',
    })

    expect(article.description).toEqual(
      'Discover the key highlights from July.',
    )
  })
})
