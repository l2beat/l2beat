import type { DaMonthlyUpdateEntry } from '../utils/getDaEntries'
import { News } from './News'

interface Props {
  daLayer: DaMonthlyUpdateEntry
}

export function DaUpdateSection({ daLayer }: Props) {
  return (
    <div id={daLayer.name} className="mt-12">
      <img
        src={`/images/monthly-updates/${daLayer.daLayerId}.png`}
        className="min-h-[60px] w-full object-cover"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2"></div>
      {daLayer.news && daLayer.news?.length > 0 && <News news={daLayer.news} />}
    </div>
  )
}
