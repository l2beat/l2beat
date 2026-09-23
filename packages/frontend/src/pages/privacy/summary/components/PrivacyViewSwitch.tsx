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
  return (
    <RadioGroup
      name="privacySummaryView"
      value={view}
      onValueChange={(value) => onChange(toPrivacySummaryView(value))}
      className="flex w-full max-md:mx-4 max-md:w-auto"
    >
      {PRIVACY_SUMMARY_VIEWS.map((v) => (
        <RadioGroupItem key={v.id} value={v.id} className="flex-1">
          {v.label}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  )
}
