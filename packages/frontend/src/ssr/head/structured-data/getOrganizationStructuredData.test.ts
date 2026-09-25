import { expect } from 'earl'
import { getOrganizationStructuredData } from './getOrganizationStructuredData'

// Compares against the literal block so a changed link or logo shows up as
// a diff of what crawlers will read.
describe(getOrganizationStructuredData.name, () => {
  it('identifies L2BEAT with its logo and social profiles', () => {
    expect(getOrganizationStructuredData()).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://l2beat.com/#organization',
      name: 'L2BEAT',
      url: 'https://l2beat.com',
      logo: 'https://l2beat.com/logo.png',
      sameAs: [
        'https://x.com/l2beat',
        'https://github.com/l2beat/l2beat',
        'https://www.linkedin.com/company/l2beat/',
        'https://www.youtube.com/channel/UCDrl-fNXFjOoykr4lQij9BA/videos',
        'https://medium.com/l2beat',
      ],
    })
  })
})
