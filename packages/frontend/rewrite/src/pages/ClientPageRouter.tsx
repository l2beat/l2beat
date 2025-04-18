import { AboutUsPage } from './about/AboutUsPage'
import { DonatePage } from './donate/DonatePage'
import { FaqPage } from './faq/FaqPage'

type Pages = typeof pages
export type SsrData = {
  [K in keyof Pages]: {
    page: K
    props: Parameters<Pages[K]>[0]
  }
}[keyof Pages]

const pages = {
  FaqPage,
  AboutUsPage,
  DonatePage,
}

export function ClientPageRouter({ ssrData }: { ssrData: SsrData }) {
  const Page = pages[ssrData.page]
  // @ts-expect-error TypeScript is not smart enough yet
  return <Page {...ssrData.props} />
}
