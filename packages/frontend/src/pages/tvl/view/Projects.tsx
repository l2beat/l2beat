import React from 'react'

import { Heading } from '../../../components'
import { FinanceIcon, ShieldWarnIcon } from '../../../components/icons'
import { FinancialView, FinancialViewProps } from './FinancialView'

interface Props {
  financialView: FinancialViewProps
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
        <span className="Projects-Button left active">
          <div className="Projects-ButtonInside">
            <FinanceIcon />
            Finances
          </div>
        </span>
        <a className="Projects-Button right" href="/scaling/risk">
          <div className="Projects-ButtonInside">
            <ShieldWarnIcon />
            Risks
          </div>
        </a>
      </div>
      <FinancialView {...props.financialView} />
    </section>
  )
}
