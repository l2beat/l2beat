import { FinanceIcon, ShieldWarnIcon } from '../../common/icons'
import { config } from '../../config'
import { FinancialView } from './FinancialView/FinancialView'
import { FinancialEntry } from './props'
import { RiskViewEntry } from './props/getRiskViewEntry'
import { RiskView } from './RiskView/RiskView'

interface Props {
  financialView: FinancialEntry[]
  riskView: RiskViewEntry[]
}

export function Projects(props: Props) {
  return (
    <section className="Projects">
      <h2 className="Projects-Title">Projects</h2>
      {!config.__DEV__showRiskView && (
        <div className="Projects-Disclaimer">
          <p className="Projects-DisclaimerContent">
            Layer twos are new &amp; experimental! Visit each project’s overview
            and learn about the risks today!
          </p>
        </div>
      )}
      {config.__DEV__showRiskView && (
        <div className="Projects-Buttons">
          <button className="Projects-Button left active">
            <div className="Projects-ButtonInside">
              <FinanceIcon />
              Finance View
            </div>
          </button>
          <button className="Projects-Button right">
            <div className="Projects-ButtonInside">
              <ShieldWarnIcon />
              Risk View
            </div>
          </button>
        </div>
      )}
      <FinancialView items={props.financialView} />
      {config.__DEV__showRiskView && <RiskView items={props.riskView} />}
    </section>
  )
}
