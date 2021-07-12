interface Props {
  name: string
  value: string
}

export function ChartButton({ name, value }: Props) {
  return (
    <label className="chart__button">
      <input type="radio" name={name} value={value} />
      <span>{value}</span>
    </label>
  )
}
