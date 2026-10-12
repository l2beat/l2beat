import { expect } from 'earl'
import { getArticleStructuredData } from './getArticleStructuredData'

// Feeds the page getMetadata would resolve plus a hand-written post, and
// compares against the literal Article a crawler should see.
describe(getArticleStructuredData.name, () => {
  const page = {
    url: 'https://l2beat.com/publications/governance-review-1',
    description:
      'L2BEAT provides weekly updates on governance in concise articles.',
    image:
      'https://l2beat.com/meta-images/publications/governance-review-1.png',
  }
  const post = {
    headline: 'Governance Review #01',
    publishedOn: new Date('2024-01-19T00:00:00Z'),
  }
  const l2beat = {
    '@type': 'Organization' as const,
    '@id': 'https://l2beat.com/#organization',
    name: 'L2BEAT',
    url: 'https://l2beat.com',
    logo: 'https://l2beat.com/logo.png',
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
      '@id': 'https://l2beat.com/publications/governance-review-1',
      url: 'https://l2beat.com/publications/governance-review-1',
      mainEntityOfPage: 'https://l2beat.com/publications/governance-review-1',
      headline: 'Governance Review #01',
      description:
        'L2BEAT provides weekly updates on governance in concise articles.',
      image:
        'https://l2beat.com/meta-images/publications/governance-review-1.png',
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

  it('credits L2BEAT for a post without a single author', () => {
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
