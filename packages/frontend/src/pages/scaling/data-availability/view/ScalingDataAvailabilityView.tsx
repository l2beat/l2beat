import { notUndefined } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import React from 'react'

import { RichSelect } from '../../../../components/RichSelect'
import { generateSlugList } from '../../../../components/table/filters/FiltersWrapper'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { getScalingDataAvailabilityColumnsConfig } from '../props/getScalingDataAvailabilityColumnsConfig'
import { ScalingDataAvailabilityViewEntry } from '../types'

export interface ScalingDataAvailabilityViewProps {
  items: ScalingDataAvailabilityViewEntry[]
}

export function ScalingDataAvailabilityView({
  items,
}: ScalingDataAvailabilityViewProps) {
  const rows: RowConfig<ScalingDataAvailabilityViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'data-availability'),
  }
  const columnsConfig = getScalingDataAvailabilityColumnsConfig()

  const daLayers = uniq(items.map((i) => i.dataAvailability.layer.value))
    .sort()
    .filter(notUndefined)
    .map((layer) => ({
      label: layer,
      value: generateSlugList(
        items,
        (i) => i.dataAvailability.layer.value === layer,
      ),
    }))

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={items}>
        <RichSelect label="DA Layer" id="da-layer-select">
          {daLayers.map((category) => (
            <RichSelect.Item
              selectedLabel={category.label}
              key={category.label}
              value={category.value}
            >
              {category.label}
            </RichSelect.Item>
          ))}
        </RichSelect>
      </ScalingFilters>
      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
    </section>
  )
}
