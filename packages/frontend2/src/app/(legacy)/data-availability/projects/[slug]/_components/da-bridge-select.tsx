'use client'
import { type DaLayer } from '@l2beat/config'
import { useState } from 'react'
import { Select } from '~/app/_components/select'

interface Props {
  layer: DaLayer
}

export function DaBridgeSelect({ layer }: Props) {
  const [value, setValue] = useState<string | undefined>(layer.bridges[0]?.id)

  return (
    <div className="flex items-center gap-2">
      <span>DA Bridge:</span>
      <Select
        options={layer.bridges.map((bridge) => ({
          value: bridge.id,
          label: `${bridge.display.name}`,
        }))}
        title=""
        onValueChange={setValue}
        value={value}
      />
    </div>
  )
}
