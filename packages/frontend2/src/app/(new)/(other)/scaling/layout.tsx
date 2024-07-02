import { ContentWrapper } from '~/app/_components/content-wrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ContentWrapper className="mt-4 md:mt-12">{children}</ContentWrapper>
}
