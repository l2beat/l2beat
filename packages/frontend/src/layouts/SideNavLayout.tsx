import { Banner } from '~/components/Banner'
import { Footer } from '~/components/Footer'
import { NavLayout } from '~/components/nav/NavLayout'

export function SideNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/scaling/summary"
      topChildren={<Banner className="lg:rounded-b-xl xl:rounded-br-none" />}
    >
      <div className="mx-auto min-h-screen max-w-screen-lg md:px-6 lg:pl-0">
        {children}
      </div>
      <Footer
        className="md:px-12 md:pt-8 lg:pr-9 lg:pl-6"
        innerContainerClassName="max-w-[1142px]"
      />
    </NavLayout>
  )
}
