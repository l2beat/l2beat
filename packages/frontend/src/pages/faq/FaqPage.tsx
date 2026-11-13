import { MainPageHeader } from '~/components/MainPageHeader'
import { Markdown } from '~/components/markdown/Markdown'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
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
            {faqItemsWithId.map((item) => (
              <section
                className="mt-6 scroll-mt-6 first:mt-0"
                id={item.id}
                key={item.id}
              >
                <a
                  href={`#${item.id}`}
                  className="mb-3 block font-semibold text-heading-20 text-primary leading-6 tracking-[-0.01em] no-underline"
                >
                  {item.question}
                </a>
                <Markdown className="font-normal text-base text-primary leading-7">
                  {item.answer}
                </Markdown>
              </section>
            ))}
          </PrimaryCard>
          <FaqSideNav entries={faqItemsWithId} />
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}

function Header() {
  return (
    <PrimaryCard className="flex flex-col gap-2">
      <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
        Hi! We are glad you&apos;ve made it to FAQs!
      </h2>
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
