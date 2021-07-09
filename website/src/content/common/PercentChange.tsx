interface Props {
  value: string
}

export function PercentChange({ value }: Props) {
  const className = value.startsWith('+')
    ? 'percent-change percent-change--up'
    : 'percent-change percent-change--down'
  return <span className={className}>{value}</span>
}
