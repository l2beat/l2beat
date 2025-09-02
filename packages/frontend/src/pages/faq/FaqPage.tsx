import { MainPageHeader } from '~/components/MainPageHeader'
import { Markdown } from '~/components/markdown/Markdown'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { FaqSideNav } from '~/pages/faq/components/FaqSideNav'
import type { FaqItem } from '~/pages/faq/FaqItems'
import { faqItems } from '~/pages/faq/FaqItems'

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
        <main className="mt-0 flex gap-8 border-divider border-t md:mt-6 md:border-t-0">
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
                    className="mb-4 block font-bold text-2xl text-primary leading-[115%] no-underline"
                  >
                    {item.question}
                  </a>
                  <Markdown className="font-normal text-base text-secondary leading-7 ">
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
      <p className="font-bold text-lg">
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
