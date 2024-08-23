import { BridgesMvpWarning } from '~/app/(new)/(other)/bridges/_components/bridges-mvp-warning'
import { ContentWrapper } from '~/app/_components/content-wrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ContentWrapper>
      <BridgesMvpWarning />
      {children}
    </ContentWrapper>
  )
}
