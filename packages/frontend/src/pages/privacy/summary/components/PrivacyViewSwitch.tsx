import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  PRIVACY_SUMMARY_VIEWS,
  type PrivacySummaryView,
  toPrivacySummaryView,
} from '../privacySummaryViews'

export function PrivacyViewSwitch({
  view,
  onChange,
}: {
  view: PrivacySummaryView
  onChange: (view: PrivacySummaryView) => void
}) {
  const current = PRIVACY_SUMMARY_VIEWS.find((v) => v.id === view)

  return (
    <div className="flex flex-col gap-1.5 max-md:px-4 md:flex-row md:items-center md:gap-3">
      <RadioGroup
        name="privacySummaryView"
        value={view}
        onValueChange={(value) => onChange(toPrivacySummaryView(value))}
        className="max-w-full overflow-x-auto"
      >
        {PRIVACY_SUMMARY_VIEWS.map((v) => (
          <RadioGroupItem key={v.id} value={v.id} className="shrink-0">
            {v.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      {current && (
        <p className="text-secondary text-xs">{current.description}</p>
      )}
    </div>
  )
}
