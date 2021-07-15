import { Header, Page } from '../../common'
import { FaqPageProps } from './getFaqPageProps'

export function FaqPage(props: FaqPageProps) {
  return (
    <Page metadata={props.metadata}>
      <Header title={props.title} />
    </Page>
  )
}
