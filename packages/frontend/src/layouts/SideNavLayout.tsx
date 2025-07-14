import { Footer } from '~/components/Footer'
import { TopBanner } from '~/components/TopBanner'
import { NavLayout } from '~/components/nav/NavLayout'

export function SideNavLayout({
  children,
  childrenWrapperClassName,
}: {
  children: React.ReactNode
  childrenWrapperClassName?: string
}) {
  return (
    <NavLayout
      logoLink="/scaling/summary"
      topChildren={<TopBanner className="2xlrounded-br-none lg:rounded-b-xl" />}
      childrenWrapperClassName={childrenWrapperClassName}
    >
      <div className="mx-auto min-h-screen max-w-(--breakpoint-lg) md:px-6 lg:pl-0">
        {children}
      </div>
      <Footer
        className="md:px-12 md:pt-8 lg:pr-9 lg:pl-6"
        innerContainerClassName="max-w-[1142px]"
      />
    </NavLayout>
  )
}
