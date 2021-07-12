interface Props {
  checked?: boolean
  name: string
  value: string
}

export function ChartButton({ checked, name, value }: Props) {
  return (
    <label className="chart__button">
      <input checked={checked} type="radio" name={name} value={value} />
      <span>{value}</span>
    </label>
  )
}
