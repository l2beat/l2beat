import { useState } from 'react'
import type { ClientApps } from '../../../../server/components/ClientApps'

export function CounterApp(props: ClientApps['counter']) {
  const [value, setValue] = useState(props.start)
  return (
    <div className="p-2">
      Count is {value}.
      <br />
      <button
        onClick={() => setValue((v) => v + props.increment)}
        className="bg-white px-2"
      >
        Increment ({props.increment})
      </button>
    </div>
  )
}
