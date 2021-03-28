import React from 'react'
import {
  XYPlot,
  LineSeries,
  LineSeriesPoint,
  XAxis,
  YAxis,
  Highlight,
  HighlightArea,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis'
import HM from 'human-readable-numbers'

interface Props {
  data: LineSeriesPoint[]
}

export const TVLHistory = React.memo(({ data }: Props) => {
  const [lastDrawLocation, setDrawLocation] = React.useState<HighlightArea | null>(null)
  const primaryColor = '#5CBAB0'

  React.useEffect(() => {
    setDrawLocation(null)
  }, [data])

  return (
    <XYPlot
      xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
      yDomain={lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top]}
      margin={{ left: 50, right: 10, top: 10, bottom: 40 }}
      height={300}
      width={670}
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

      <LineSeries color={primaryColor} data={data} />
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
