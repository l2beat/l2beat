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
        className="w-full mb-8"
      />
      {ecosystem.news && ecosystem.news?.length > 0 && (
        <News news={ecosystem.news} />
      )}
    </div>
  )
}
