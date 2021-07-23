import { Footer, Navbar, Page } from '../../common'
import { FaqPageProps } from './getFaqPageProps'

export function FaqPage(props: FaqPageProps) {
  return (
    <Page metadata={props.metadata}>
      <Navbar />
      <article
        className="Faq"
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
      <Footer />
    </Page>
  )
}
