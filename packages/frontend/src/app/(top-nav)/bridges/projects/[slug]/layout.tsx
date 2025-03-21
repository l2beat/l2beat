import { BridgesMvpWarning } from '~/app/(top-nav)/bridges/projects/[slug]/_components/bridges-mvp-warning'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="smooth-scroll">
      <BridgesMvpWarning className="w-full" />
      {children}
      <ScrollToTopButton />
    </div>
  )
}
