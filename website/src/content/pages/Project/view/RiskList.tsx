import { ShieldBadIcon } from '../../../common/icons'
import { TechnologyRisk } from '../props'
import { References } from './References'

interface Props {
  risks: TechnologyRisk[]
}

export function RiskList({ risks }: Props) {
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
