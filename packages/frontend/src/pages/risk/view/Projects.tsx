import React from 'react'

import { Heading } from '../../../components'
import { FinanceIcon, ShieldWarnIcon } from '../../../components/icons'
import { RiskView, RiskViewProps } from './RiskView'

interface Props {
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
        <a className="Projects-Button left" href="/scaling/tvl">
          <div className="Projects-ButtonInside">
            <FinanceIcon />
            Finances
          </div>
        </a>
        <span className="Projects-Button right active">
          <div className="Projects-ButtonInside">
            <ShieldWarnIcon />
            Risks
          </div>
        </span>
      </div>
      <RiskView {...props.riskView} />
    </section>
  )
}
