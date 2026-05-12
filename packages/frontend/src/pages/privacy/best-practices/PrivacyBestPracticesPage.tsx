import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { CollectionEntry } from '~/content/getCollection'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {
  content: CollectionEntry<'pages'>
}

export function PrivacyBestPracticesPage({ content, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Practical guidance for using Ethereum privacy protocols while preserving address, timing, amount, software, and network privacy.">
          Privacy
        </MainPageHeader>
        <PrimaryCard className="md:p-8">
          <CustomLink
            href="/privacy/summary"
            underline={false}
            className="inline-flex items-center gap-2 text-xs uppercase"
          >
            <ArrowRightIcon className="size-3 rotate-180" />
            Privacy Summary
          </CustomLink>
          <main className="mx-auto mt-8 max-w-[760px]">
            <Article className="extended-char-set [&>h2:first-child]:mt-0 [&_img]:my-8 [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-divider [&_img]:bg-pure-black [&_img]:shadow-sm [&_li]:ml-0 [&_li]:rounded-lg [&_li]:border [&_li]:border-divider [&_li]:bg-surface-secondary [&_li]:p-4 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-3 [&_ul]:pl-0">
              {content.content}
            </Article>
          </main>
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
