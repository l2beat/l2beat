import { ContentWrapper } from '~/app/_components/content-wrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ContentWrapper>{children}</ContentWrapper>
}
