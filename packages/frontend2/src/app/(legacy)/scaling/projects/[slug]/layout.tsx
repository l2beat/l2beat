import { ScrollToTopButton } from '~/app/_components/scroll-to-top-button'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTopButton />
    </>
  )
}
