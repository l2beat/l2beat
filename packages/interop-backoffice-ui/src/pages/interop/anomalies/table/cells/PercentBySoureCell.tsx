import { ColoredPercent } from './ColoredPercent'
import { MetricLine } from './MetricLine'

export function PercentBySourceCell(props: {
  srcPctDay: number | null
  srcPct7d: number | null
  dstPctDay: number | null
  dstPct7d: number | null
}) {
  return (
    <div className="flex min-w-[11rem] flex-col">
      <MetricLine>
        Src 1d <ColoredPercent value={props.srcPctDay} /> | 7d{' '}
        <ColoredPercent value={props.srcPct7d} />
      </MetricLine>
      <MetricLine>
        Dst 1d <ColoredPercent value={props.dstPctDay} /> | 7d{' '}
        <ColoredPercent value={props.dstPct7d} />
      </MetricLine>
    </div>
  )
}
