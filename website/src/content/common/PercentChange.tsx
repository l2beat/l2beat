import cx from 'classnames'

interface Props {
  value: string
}

export function PercentChange({ value }: Props) {
  const className = cx('PercentChange', value.startsWith('+') ? 'up' : 'down')
  return <span className={className}>{value}</span>
}
