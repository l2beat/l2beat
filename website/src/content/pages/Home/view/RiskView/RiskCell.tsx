import cx from 'classnames'
import { ProjectRiskViewEntry } from '@l2beat/config'

interface Props {
  item: ProjectRiskViewEntry
}

export function RiskCell({ item }: Props) {
  return (
    <span
      className={cx('RiskCell', item.sentiment, 'Tooltip')}
      title={item.description}
    >
      {item.value}
    </span>
  )
}
