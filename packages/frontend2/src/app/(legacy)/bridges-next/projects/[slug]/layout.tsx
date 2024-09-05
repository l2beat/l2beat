import { BridgesMvpWarning } from '~/app/(new)/(other)/bridges/_components/bridges-mvp-warning'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { ScrollToTopButton } from '~/app/_components/scroll-to-top-button'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ContentWrapper mobileFull>
      <BridgesMvpWarning />
      {children}
      <ScrollToTopButton />
    </ContentWrapper>
  )
}
