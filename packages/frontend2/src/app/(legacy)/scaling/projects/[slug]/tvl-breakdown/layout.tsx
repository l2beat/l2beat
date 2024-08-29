import { ContentWrapper } from '~/app/_components/content-wrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ContentWrapper mobileFull className="mx-auto h-full max-w-[928px]">
      {children}
    </ContentWrapper>
  )
}
