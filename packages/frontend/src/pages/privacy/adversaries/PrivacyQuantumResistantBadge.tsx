import { QuantumResistanceIcon } from '~/icons/QuantumResistance'
import { cn } from '~/utils/cn'
import { PRIVACY_QUANTUM_RESISTANT_LABEL } from './privacyAdversaryUi'

/** The quantum resistance lock of the ZK catalog, spelled out for the future adversary. */
export function PrivacyQuantumResistantBadge({
  className,
}: {
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded bg-positive/15 px-1.5 py-0.5 font-medium text-green-700 text-xs dark:bg-positive/20 dark:text-green-450',
        className,
      )}
    >
      <QuantumResistanceIcon className="size-3.5" />
      {PRIVACY_QUANTUM_RESISTANT_LABEL}
    </span>
  )
}
