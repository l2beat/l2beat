import { ShieldBadIcon } from '../../../common/icons'
import { References } from './References'

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
          <References ids={risk.referenceIds} />
        </li>
      ))}
    </ul>
  )
}
