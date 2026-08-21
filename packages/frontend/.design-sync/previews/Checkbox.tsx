import { Checkbox } from '@l2beat/frontend'

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Checkbox name="unchecked">Unchecked</Checkbox>
      <Checkbox name="checked" defaultChecked>
        Checked
      </Checkbox>
      <Checkbox name="disabled" disabled>
        Disabled
      </Checkbox>
    </div>
  )
}

export function FilterGroup() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Checkbox name="rollups" defaultChecked>
        Rollups
      </Checkbox>
      <Checkbox name="validiums" defaultChecked>
        Validiums
      </Checkbox>
      <Checkbox name="optimiums">Optimiums</Checkbox>
      <Checkbox name="others" labelTitle="Everything else">
        Others
      </Checkbox>
    </div>
  )
}
