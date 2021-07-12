import { Footer, Navbar, Page } from '../../common'
import { HomePageProps } from './getHomePageProps'
import { Header } from './Header'
import { Projects } from './Projects'

export function HomePage(props: HomePageProps) {
  return (
    <Page
      title="L2BEAT – The state of the layer two ecosystem"
      preloadApi="/api/tvl.json"
    >
      <Navbar />
      <Header tvl={props.tvl} sevenDayChange={props.sevenDayChange} />
      <canvas id="chart" style={{ width: '100%', height: '300px' }} />
      <Projects financialView={props.financialView} />
      <Footer />
    </Page>
  )
}
