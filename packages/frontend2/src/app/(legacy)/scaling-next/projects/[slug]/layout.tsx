import { ContentWrapper } from '~/app/_components/content-wrapper'
import { ScrollToTopButton } from '~/app/_components/scroll-to-top-button'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ContentWrapper mobileFull>
      {children}
      <ScrollToTopButton />
    </ContentWrapper>
  )
}
