import HM from 'human-readable-numbers'
import millify from 'millify'
import React from 'react'
import {
  Crosshair,
  Highlight,
  HighlightArea,
  HorizontalGridLines,
  LineSeries,
  LineSeriesPoint,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis'

interface Props {
  data: LineSeriesPoint[]
  container: DOMRect | null
}

export const TVLHistory = React.memo(({ data, container }: Props) => {
  const [lastDrawLocation, setDrawLocation] = React.useState<HighlightArea | null>(null)
  const [crosshair, setCrosshair] = React.useState<LineSeriesPoint[]>([])
  const primaryColor = '#5CBAB0'

  React.useEffect(() => {
    setDrawLocation(null)
  }, [data])

  if (container === null) {
    return null
  }

  return (
    <XYPlot
      // animation
      xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
      yDomain={lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top]}
      margin={{ left: 50, right: 10, top: 10, bottom: 40 }}
      height={300}
      width={container.width}
      onMouseLeave={() => setCrosshair([])}
    >
      <HorizontalGridLines />
      <VerticalGridLines />
      <XAxis
        tickTotal={5}
        // tickLabelAngle={-90}
        tickFormat={function tickFormat(d) {
          return new Date(d).toLocaleDateString()
        }}
      />
      <YAxis
        title="USD"
        tickPadding={10}
        tickFormat={function tickFormat(d) {
          return HM.toHumanString(d)
        }}
      />
      <LineSeries color={primaryColor} data={data} onNearestX={(data) => setCrosshair([data])} />
      {crosshair.map(() => (
        <Crosshair
          values={crosshair}
          titleFormat={(points) => ({ title: 'Date', value: points[0].x.toLocaleDateString() })}
          itemsFormat={(points) => points.map((pt: LineSeriesPoint) => ({ title: 'USD', value: millify(pt.y) }))}
        ></Crosshair>
      ))}
      <Highlight
        onBrushEnd={(area) => setDrawLocation(area)}
        onDrag={(area) => {
          area &&
            setDrawLocation({
              bottom: (lastDrawLocation?.bottom! | 0) + (area.top! - area.bottom!),
              left: lastDrawLocation?.left! - (area.right! - area.left!),
              right: lastDrawLocation?.right! - (area.right! - area.left!),
              top: lastDrawLocation?.top! + (area.top! - area.bottom!),
            })
        }}
      />
    </XYPlot>
  )
})
