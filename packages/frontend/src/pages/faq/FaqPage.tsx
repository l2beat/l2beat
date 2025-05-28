import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { MainPageHeader } from '~/components/main-page-header'
import { Markdown } from '~/components/markdown/markdown'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { FaqSideNav } from '~/pages/faq/components/faq-side-nav'
import type { FaqItem } from '~/pages/faq/faq-items'
import { faqItems } from '~/pages/faq/faq-items'

export interface FaqItemWithId extends FaqItem {
  id: string
}

export function FaqPage(props: AppLayoutProps) {
  const faqItemsWithId: FaqItemWithId[] = faqItems.map((item) => ({
    ...item,
    id: questionToId(item.question),
  }))
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>FAQ</MainPageHeader>
        <Header />
        <main className="mt-0 flex gap-8 border-t border-divider md:mt-6 md:border-t-0">
          <PrimaryCard>
            {faqItemsWithId.map((item) => {
              const answer = Array.isArray(item.answer)
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
      </SideNavLayout>
    </AppLayout>
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
