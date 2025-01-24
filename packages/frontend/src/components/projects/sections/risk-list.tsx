import { ShieldIcon } from '~/icons/shield'

export interface RiskList {
  risks: TechnologyRisk[]
}

export interface TechnologyRisk {
  text: string
  isCritical: boolean
}

export function RiskList({ risks }: RiskList) {
  if (risks.length === 0) {
    return null
  }

  return (
    <ul className="mt-4 rounded-lg bg-negative/20 p-4 md:mt-6">
      {risks.map((risk, i) => (
        <li className="mt-2 flex gap-3 first:mt-0" key={i}>
          <ShieldIcon className="shrink-0 fill-red-300" />
          <p className="leading-snug">
            {risk.isCritical ? (
              <>
                {risk.text.slice(0, -1)}{' '}
                <strong className="text-red-300">(CRITICAL)</strong>
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
