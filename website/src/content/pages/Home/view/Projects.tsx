import { Heading } from '../../../common'
import { FinanceIcon, ShieldWarnIcon } from '../../../common/icons'
import { config } from '../../../config'
import {
  FinancialView,
  FinancialViewProps,
} from './FinancialView/FinancialView'
import { RiskView, RiskViewProps } from './RiskView/RiskView'

interface Props {
  financialView: FinancialViewProps
  riskView: RiskViewProps
}

export function Projects(props: Props) {
  return (
    <section className="Projects">
      <Heading
        level={2}
        id="projects"
        title="Projects"
        className="Projects-Title"
      />
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
              Finances
            </div>
          </button>
          <button className="Projects-Button right">
            <div className="Projects-ButtonInside">
              <ShieldWarnIcon />
              Risks
            </div>
          </button>
        </div>
      )}
      <FinancialView {...props.financialView} />
      {config.__DEV__showRiskView && <RiskView {...props.riskView} />}
    </section>
  )
}
