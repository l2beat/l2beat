import { ScrollToTopButton } from '~/components/scroll-to-top-button'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="smooth-scroll">
      {children}
      <ScrollToTopButton />
    </div>
  )
}
