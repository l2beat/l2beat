import cx from 'classnames'
import { RiskViewItem } from '../props/getRiskViewEntry'

interface Props {
  item: RiskViewItem
}

export function RiskCell({ item }: Props) {
  return <span className={cx('RiskCell', item.sentiment)}>{item.value}</span>
}
