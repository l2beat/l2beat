import { CRITICAL_TEXT_CLASS } from '~/components/WarningBar'
import { ShieldIcon } from '~/icons/Shield'
import { cn } from '~/utils/cn'

export interface RiskList {
  risks: TechnologyRisk[]
  className?: string
}

export interface TechnologyRisk {
  text: string
  isCritical: boolean
}

export function RiskList({ risks, className }: RiskList) {
  if (risks.length === 0) {
    return null
  }

  return (
    <ul
      className={cn(
        'mt-4 rounded-lg bg-surface-negative p-4 md:mt-6',
        className,
      )}
    >
      {risks.map((risk, i) => (
        <li className="mt-2 flex gap-3 first:mt-0" key={i}>
          <ShieldIcon className="shrink-0 fill-negative" />
          <p className="text-paragraph-15 md:text-paragraph-16">
            {risk.isCritical ? (
              <>
                {risk.text.slice(0, -1)}{' '}
                <strong className={CRITICAL_TEXT_CLASS}>(CRITICAL)</strong>
                {risk.text.slice(-1)}
              </>
            ) : (
              risk.text
            )}
          </p>
        </li>
      ))}
    </ul>
  )
}
