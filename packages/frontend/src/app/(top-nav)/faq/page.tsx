import { isArray } from 'lodash'
import type { Metadata } from 'next'
import { ContentWrapper } from '~/components/content-wrapper'
import { FullPageHeader } from '~/components/full-page-header'
import { Markdown } from '~/components/markdown/markdown'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { getDefaultMetadata } from '~/utils/metadata'
import { faqItems } from './faq-items'

export const metadata: Metadata = getDefaultMetadata({
  title: 'FAQ - L2BEAT',
  description:
    'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
  openGraph: {
    url: '/faq',
  },
})

export default async function Page() {
  const faqItemsWithId = faqItems.map((item) => ({
    ...item,
    id: questionToId(item.question),
  }))

  return (
    <div className="reading">
      <Header />
      <ContentWrapper>
        <main className="flex">
          <div className="mt-12 hidden w-72 shrink-0 flex-col gap-4 lg:flex">
            {faqItemsWithId.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-base font-medium text-gray-850 transition hover:text-brand dark:text-white dark:opacity-80 dark:hover:opacity-100"
              >
                {item.question}
              </a>
            ))}
          </div>
          <article className="lg:ml-16">
            {faqItemsWithId.map((item) => {
              const answer = isArray(item.answer)
                ? item.answer.join('\n\n')
                : item.answer
              return (
                <section className="mt-12" id={item.id} key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="mb-4 block text-2xl font-bold text-gray-850 no-underline dark:text-white"
                  >
                    {item.question}
                  </a>
                  <Markdown className="text-lg text-gray-850 dark:text-white">
                    {answer}
                  </Markdown>
                </section>
              )
            })}
          </article>
        </main>
      </ContentWrapper>
      <ScrollToTopButton />
    </div>
  )
}

function Header() {
  return (
    <FullPageHeader>
      <div className="w-full">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:justify-between">
          <h1 className="text-5xl font-bold md:text-6xl">FAQ</h1>
          <p className="w-full text-lg font-light lg:w-2/3">
            Hi! We are glad you&apos;ve made it here. Below you will find
            answers to most frequently asked questions about L2BEAT.
          </p>
        </div>
      </div>
    </FullPageHeader>
  )
}

function questionToId(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // remove leading and trailing hyphens
}
