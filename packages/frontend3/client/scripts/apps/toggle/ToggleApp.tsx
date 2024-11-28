import { useId, useState } from 'react'
import { ClientApps } from '../../../../server/components/ClientApps'

export function ToggleApp(props: ClientApps['toggle']) {
  const [checked, setChecked] = useState(false)
  const id = useId()
  return (
    <label htmlFor={id} className="select-none">
      <span>{props.label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </label>
  )
}
