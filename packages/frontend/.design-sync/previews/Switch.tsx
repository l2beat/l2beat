import { Switch } from '@l2beat/frontend'

export function States() {
  return (
    <div className="flex items-center gap-6">
      <Switch name="preview-off" defaultChecked={false} />
      <Switch name="preview-on" defaultChecked />
      <Switch name="preview-disabled" disabled />
      <Switch name="preview-disabled-on" disabled defaultChecked />
    </div>
  )
}

export function WithLabels() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex items-center justify-between gap-4">
        <span className="text-primary text-sm">Include rollups only</span>
        <Switch name="rollups-only" defaultChecked />
      </label>
      <label className="flex items-center justify-between gap-4">
        <span className="text-primary text-sm">Show archived projects</span>
        <Switch name="show-archived" />
      </label>
    </div>
  )
}
