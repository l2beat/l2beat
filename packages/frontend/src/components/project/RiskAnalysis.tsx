import React from 'react'

import { RiskValues } from '../../utils/risks/types'
import { Section } from './Section'

export interface RiskAnalysisProps {
  riskValues: RiskValues
}

export function RiskAnalysis({ riskValues }: RiskAnalysisProps) {
  return (
    <Section title="Risk analysis" id="risks" className="mt-4">
      <div>
        <h3 className="font-bold uppercase">State validation</h3>
        <span>{riskValues.stateValidation.value}</span>
        <p>{riskValues.stateValidation.description}</p>
      </div>
    </Section>
  )
}
