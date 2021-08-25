import { ShieldBadIcon } from '../../../common/icons'
import { InlineReferences } from './InlineReferences'

export interface RiskList {
  risks: TechnologyRisk[]
}

export interface TechnologyRisk {
  text: string
  referenceIds: number[]
}

export function RiskList({ risks }: RiskList) {
  return (
    <ul className="RiskList">
      {risks.map((risk, i) => (
        <li className="RiskList-Item" key={i}>
          <ShieldBadIcon />
          {risk.text}
          <InlineReferences ids={risk.referenceIds} />
        </li>
      ))}
    </ul>
  )
}
