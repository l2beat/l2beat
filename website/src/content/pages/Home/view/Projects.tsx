import React from 'react'
import { Heading } from '../../../common'
import { FinanceIcon, ShieldWarnIcon } from '../../../common/icons'
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
      <FinancialView {...props.financialView} />
      <RiskView {...props.riskView} />
    </section>
  )
}
