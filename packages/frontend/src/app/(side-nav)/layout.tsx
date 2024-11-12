import { Banner } from '~/components/banner'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'
import { env } from '~/env'
import { cn } from '~/utils/cn'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/scaling/summary"
      topChildren={<Banner className="lg:rounded-b-xl xl:rounded-br-none" />}
      className={cn(
        'sidebar',
        env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION && 'recategorised',
      )}
    >
      <div className="mx-auto min-h-screen max-w-screen-lg md:px-6 lg:pl-0 lg:pr-3">
        {children}
      </div>
      <Footer />
    </NavLayout>
  )
}
