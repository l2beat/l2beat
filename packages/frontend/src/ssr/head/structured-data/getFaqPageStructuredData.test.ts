import { expect } from 'earl'
import { faqItems } from '~/pages/faq/FaqItems'
import { getFaqPageStructuredData } from './getFaqPageStructuredData'

// Runs against the real FAQ content so the test also guards what ships.
describe(getFaqPageStructuredData.name, () => {
  const faqPage = getFaqPageStructuredData(faqItems)

  it('is an FAQPage with one Question per FAQ entry', () => {
    expect(faqPage['@context']).toEqual('https://schema.org')
    expect(faqPage['@type']).toEqual('FAQPage')
    expect(faqPage.mainEntity.length).toEqual(faqItems.length)
  })

  it('pairs each question with its answer rendered to HTML', () => {
    expect(faqPage.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'What is the overall purpose of this site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '<p>L2BEAT was created to provide transparent and verifiable insights into emerging layer two (L2) technologies which, in line with the <a href="https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698">rollup-centric Ethereum scaling roadmap</a> are aimed at scaling Ethereum.</p>\n',
      },
    })
  })

  it('keeps every paragraph of a multi-paragraph answer', () => {
    const question = faqPage.mainEntity.find(
      (q) => q.name === 'How do L2s derive their security from L1?',
    )

    expect(question?.acceptedAnswer.text.match(/<p>/g)?.length).toEqual(3)
  })
})
