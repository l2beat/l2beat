import { isArray } from 'lodash'
import type { Metadata } from 'next'
import { MainPageHeader } from '~/components/main-page-header'
import { Markdown } from '~/components/markdown/markdown'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { getDefaultMetadata } from '~/utils/metadata'
import { FaqSideNav } from './_components/faq-side-nav'
import type { FaqItem } from './faq-items'
import { faqItems } from './faq-items'

export const metadata: Metadata = getDefaultMetadata({
  title: 'FAQ - L2BEAT',
  description:
    'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
  openGraph: {
    url: '/faq',
  },
})

export interface FaqItemWithId extends FaqItem {
  id: string
}

export default async function Page() {
  const faqItemsWithId: FaqItemWithId[] = faqItems.map((item) => ({
    ...item,
    id: questionToId(item.question),
  }))

  return (
    <>
      <MainPageHeader>FAQ</MainPageHeader>
      <Header />
      <main className="mt-0 flex gap-8 border-t border-divider md:mt-6 md:border-t-0">
        <PrimaryCard>
          {faqItemsWithId.map((item) => {
            const answer = isArray(item.answer)
              ? item.answer.join('\n\n')
              : item.answer
            return (
              <section
                className="mt-6 scroll-mt-6 first:mt-0"
                id={item.id}
                key={item.id}
              >
                <a
                  href={`#${item.id}`}
                  className="mb-4 block text-2xl font-bold leading-[115%] text-primary no-underline"
                >
                  {item.question}
                </a>
                <Markdown className="text-base font-normal leading-7 text-secondary ">
                  {answer}
                </Markdown>
              </section>
            )
          })}
        </PrimaryCard>
        <FaqSideNav entries={faqItemsWithId} />
      </main>
      <ScrollToTopButton />
    </>
  )
}

function Header() {
  return (
    <PrimaryCard className="flex flex-col">
      <h1 className="mb-4 text-3xl font-bold md:hidden">FAQ</h1>
      <p className="text-lg font-bold">
        Hi! We are glad you&apos;ve made it to FAQs!
      </p>
      <p>
        Below, you will find answers to the most frequently asked questions to
        help you better understand our website.
      </p>
    </PrimaryCard>
  )
}

function questionToId(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // remove leading and trailing hyphens
}
