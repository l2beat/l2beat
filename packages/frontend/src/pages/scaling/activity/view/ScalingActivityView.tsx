import React from 'react'

import uniq from 'lodash/uniq'
import { RichSelect } from '../../../../components/RichSelect'
import { TableView } from '../../../../components/table/TableView'
import { generateSlugList } from '../../../../components/table/filters/FiltersWrapper'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { RowConfig } from '../../../../components/table/types'
import { getScalingActivityColumnsConfig } from '../props/getScalingActivityColumnsConfig'
import { ActivityViewEntry } from '../types'
export interface ScalingActivityViewProps {
  items: ActivityViewEntry[]
}

export function ScalingActivityView({ items }: ScalingActivityViewProps) {
  const columns = getScalingActivityColumnsConfig()
  const rows: RowConfig<ActivityViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'activity'),
  }

  const itemsWithoutEthereum = items.filter((i) => i.slug !== 'ethereum')

  const layers = uniq(itemsWithoutEthereum.map((i) => i.type))
    .sort()
    .map((l) => ({
      label: toLayerLabel(l),
      value: generateSlugList(items, (i) => i.type === l),
    }))

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={itemsWithoutEthereum} childrenPosition="first">
        <RichSelect label="Layer" id="layer">
          {layers.map((layer) => (
            <RichSelect.Item
              selectedLabel={layer.label}
              key={layer.label}
              value={layer.value}
            >
              {layer.label}
            </RichSelect.Item>
          ))}
        </RichSelect>
      </ScalingFilters>
      <TableView items={items} columnsConfig={columns} rows={rows} />
    </section>
  )
}

function toLayerLabel(layer: 'layer2' | 'layer3' | undefined) {
  switch (layer) {
    case 'layer2':
      return 'Layer 2'
    case 'layer3':
      return 'Layer 3'
    default:
      return 'No provider'
  }
}
