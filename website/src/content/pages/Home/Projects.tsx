import { FinancialView } from './FinancialView'
import { FinancialEntry } from './getHomePageProps'

interface Props {
  financialView: FinancialEntry[]
}

export function Projects(props: Props) {
  return (
    <section className="Projects">
      <h2 className="Projects-Title">Projects</h2>
      <div className="Projects-Disclaimer">
        <p className="Projects-DisclaimerContent">
          Layer twos are new &amp; experimental! Visit each project’s overview
          and learn about the risks today!
        </p>
      </div>
      <FinancialView items={props.financialView} />
    </section>
  )
}
