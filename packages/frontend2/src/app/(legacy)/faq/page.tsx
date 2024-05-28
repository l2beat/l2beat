import { type Metadata } from 'next'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { ScrollToTopButton } from '~/app/_components/scroll-to-top-button'
import { getFaqItems } from './get-faq-items'

export const metadata: Metadata = {
  title: 'FAQ - L2BEAT',
  description:
    'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
  openGraph: {
    url: '/faq',
  },
}

export default async function Page() {
  const faqItems = getFaqItems()

  return (
    <>
      <Header />
      <ContentWrapper>
        <div className="flex">
          <div className="mt-12 hidden w-72 shrink-0 flex-col gap-4 lg:flex">
            {faqItems.map((item) => (
              <a
                key={questionToId(item.question)}
                href={`#${questionToId(item.question)}`}
                className="text-base font-semibold text-gray-850 transition hover:text-pink-900 dark:text-white dark:opacity-80 dark:hover:text-pink-200 dark:hover:opacity-100"
              >
                {item.question}
              </a>
            ))}
          </div>
          <article className="lg:ml-16">
            {faqItems.map((item) => (
              <section
                className="mt-12"
                id={questionToId(item.question)}
                key={questionToId(item.question)}
              >
                <a
                  href={`#${questionToId(item.question)}`}
                  className="mb-4 block text-2xl font-bold text-gray-850 no-underline dark:text-white"
                >
                  {item.question}
                </a>
                <span className="text-lg text-gray-850 dark:text-white">
                  {item.answer}
                </span>
              </section>
            ))}
          </article>
        </div>
      </ContentWrapper>
      <ScrollToTopButton />
    </>
  )
}

function Header() {
  return (
    <header className="bg-pure-white py-24 dark:bg-zinc-900">
      <ContentWrapper className="flex items-center justify-center leading-[1.15]">
        <div className="w-full">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:justify-between">
            <h1 className="text-6xl font-bold">FAQ</h1>
            <p className="font-light w-full text-lg lg:w-2/3">
              Hi! We are glad you&apos;ve made it here. Below you will find
              answers to most frequently asked questions about L2BEAT.
            </p>
          </div>
        </div>
      </ContentWrapper>
    </header>
  )
}

function questionToId(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // remove leading and trailing hyphens
}
