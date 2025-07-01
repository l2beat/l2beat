import type { EcosystemUpdate } from '~/content/monthly-updates'
import { News } from './News'

interface Props {
  ecosystem: EcosystemUpdate
}

export function EcosystemUpdateSection({ ecosystem }: Props) {
  return (
    <div>
      <img
        src={`/images/monthly-updates/${ecosystem.ecosystemId}.png`}
        className="mb-8 min-h-[60px] w-full object-cover"
      />
      {ecosystem.news && ecosystem.news?.length > 0 && (
        <News news={ecosystem.news} />
      )}
    </div>
  )
}
