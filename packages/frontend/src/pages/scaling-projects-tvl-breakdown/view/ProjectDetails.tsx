import React from 'react'
import { SummaryBox } from '../../../components/tvl-breakdown/SummaryBox'

export interface ProjectDetailsProps {}

const MOCK_DATA = {
  tvl: {
    value: '$5.47 B',
    change: '+ 2.9%',
  },
  cb: {
    value: '$2.99 B',
    change: '+ 2.38%',
  },
  eb: {
    value: '$2.2 B',
    change: '- 11.14%',
  },
  ntm: {
    value: '$280 M',
    change: '+ 12.49%',
  },
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div className="px-4 md:px-0">
      <SummaryBox {...MOCK_DATA} />
    </div>
  )
}
