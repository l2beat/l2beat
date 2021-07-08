import { Page } from '../../common/Page'
import { Footer } from '../../common/Footer'
import { Navbar } from '../../common/Navbar'
import { HomePageProps } from './getHomePageProps'

export function HomePage(props: HomePageProps) {
  return (
    <Page title="L2BEAT – The state of the layer two ecosystem">
      <Navbar />
      <h1>Overview</h1>
      <p>TVL: {props.tvl}</p>
      <p>{props.sevenDayChange} / 7 days</p>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Total Value Locked</th>
            <th>1 day change</th>
            <th>7 day change</th>
            <th>Market share</th>
          </tr>
        </thead>
        <tbody>
          {props.financialView.map((project, i) => (
            <tr key={i}>
              <td>{i + 1}.</td>
              <td>
                <a href={`/projects/${project.slug}`}>{project.name}</a>
              </td>
              <td>{project.tvl}</td>
              <td>{project.oneDayChange}</td>
              <td>{project.sevenDayChange}</td>
              <td>{project.marketShare}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </Page>
  )
}
