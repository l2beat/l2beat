import { formatSignedDiff } from '../../utils'
import { ColoredPercent } from './ColoredPercent'
import { MetricLine } from './MetricLine'

export function CountDeltaCell(props: {
  diffDay: number | null
  diff7d: number | null
  pctDiffDay: number | null
  pctDiff7d: number | null
}) {
  return (
    <div className="flex min-w-[10rem] flex-col">
      <MetricLine>
        1d {formatSignedDiff(props.diffDay, 0)} (
        <ColoredPercent value={props.pctDiffDay} />)
      </MetricLine>
      <MetricLine>
        7d {formatSignedDiff(props.diff7d, 0)} (
        <ColoredPercent value={props.pctDiff7d} />)
      </MetricLine>
    </div>
  )
}
