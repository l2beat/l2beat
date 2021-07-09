import { FinancialView } from './FinancialView'
import { FinancialEntry } from './getHomePageProps'

interface Props {
  financialView: FinancialEntry[]
}

export function Projects(props: Props) {
  return (
    <section className="projects">
      <h2 className="projects__title">Projects</h2>
      <p className="projects__disclaimer">
        Layer two systems are new &amp; experimental technology! Visit each
        project’s overview and learn about the risks today!
      </p>
      <FinancialView items={props.financialView} />
    </section>
  )
}
