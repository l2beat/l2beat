import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {
  title: string
  markdown: string
}

export function ApiMigrationPage({ title, markdown, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>{title}</MainPageHeader>
        <PrimaryCard>
          <main>
            {/* MainPageHeader shows its title on desktop only */}
            <h1 className="mb-4 font-bold text-2xl lg:hidden">{title}</h1>
            <Article className="break-words text-base leading-7 [&_h2]:text-[22px]">
              {markdown}
            </Article>
          </main>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
