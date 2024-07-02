import React from 'react'
import { providerMap } from '~/app/_components/table/cells/type-cell'

export function ScalingLegend() {
  const entries = Object.entries(providerMap)

  return (
    <div className="mt-6 grid gap-2 text-sm md:grid-cols-2">
      {entries.map(([key, value]) => {
        if (!value) return null
        const { Icon, text } = value
        return (
          <p className="flex gap-1" key={key}>
            <Icon className="-top-0.5 size-6 relative min-w-[24px]" />
            <span>&ndash;</span>
            <span>{text}</span>
          </p>
        )
      })}
    </div>
  )
}
