import React from 'react'

export function ChartHover() {
  return (
    <div data-role="chart-hover" className="ChartHover hidden">
      <div data-role="chart-hover-line" className="ChartHover-Line" />
      <div data-role="chart-hover-circle" className="ChartHover-Circle" />
      <div data-role="chart-hover-contents" className="ChartHover-Contents">
        <div data-role="chart-hover-date" className="ChartHover-Date" />
        <div data-role="chart-hover-value-a" className="ChartHover-ValueA" />
        <div data-role="chart-hover-value-b" className="ChartHover-ValueB" />
      </div>
    </div>
  )
}
