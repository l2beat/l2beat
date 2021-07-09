import { Footer, Navbar, Page } from '../../common'
import { HomePageProps } from './getHomePageProps'
import { Header } from './Header'
import { Projects } from './Projects'

export function HomePage(props: HomePageProps) {
  return (
    <Page title="L2BEAT – The state of the layer two ecosystem">
      <Navbar />
      <Header tvl={props.tvl} sevenDayChange={props.sevenDayChange} />
      <Projects financialView={props.financialView} />
      <Footer />
    </Page>
  )
}
