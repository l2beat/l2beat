export function ChartHover() {
  return (
    <div className="chart-hover chart-hover--hidden">
      <div className="chart-hover__line" />
      <div className="chart-hover__circle" />
      <div className="chart-hover__contents">
        <div className="chart-hover__date" />
        <div className="chart-hover__value-a" />
        <div className="chart-hover__value-b" />
      </div>
    </div>
  )
}
