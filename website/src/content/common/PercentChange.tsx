interface Props {
  value: string
}

export function PercentChange({ value }: Props) {
  const className = value.startsWith('+')
    ? 'percent percent--up'
    : 'percent percent--down'
  return <span className={className}>{value}</span>
}
