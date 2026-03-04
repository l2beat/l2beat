import { Badge } from '../../components/Badge'
import { ProtocolTypeBadge } from '../../components/ProtocolTypeBadge'
import { StatCard } from '../../components/StatCard'
import { formatUsdValue } from '../../utils/format'
import { computeEntityDependencyCount } from '../../utils/dependencies'
import type { CompiledReview } from '../../types'

interface ReviewHeaderProps {
  review: CompiledReview
}

export function ReviewHeader({ review }: ReviewHeaderProps) {
  const { metadata, totals } = review

  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-text-primary">
          {metadata.protocolName}
        </h1>
        <ProtocolTypeBadge type={metadata.projectType} />
        <Badge>{metadata.chain}</Badge>
        {metadata.tokenName && (
          <Badge variant="purple">{metadata.tokenName}</Badge>
        )}
      </div>

      {metadata.description && (
        <p className="mt-4 text-text-secondary leading-relaxed max-w-3xl">
          {metadata.description}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Contracts" value={String(totals.contractCount)} />
        <StatCard
          label="Permissioned Functions"
          value={String(totals.permissionedFunctionCount)}
        />
        <StatCard
          label="Admins"
          value={String(totals.adminCount)}
          sublabel={formatUsdValue(totals.totalCapitalAtRisk) + ' locked'}
        />
        <StatCard
          label="Dependencies"
          value={String(computeEntityDependencyCount(review.dependencies))}
        />
      </div>
    </div>
  )
}
