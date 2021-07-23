export function ChartHover() {
  return (
    <div className="ChartHover hidden">
      <div className="ChartHover-Line" />
      <div className="ChartHover-Circle" />
      <div className="ChartHover-Contents">
        <div className="ChartHover-Date" />
        <div className="ChartHover-ValueA" />
        <div className="ChartHover-ValueB" />
      </div>
    </div>
  )
}
