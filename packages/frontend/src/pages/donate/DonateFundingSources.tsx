import React from 'react'

import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../components/table/TableView'

export interface DonateFundingSourcesProps {
  items: DonateFundingSourceEntry[]
}

interface DonateFundingSourceEntry {
  source: string
  tier: 'Significant' | 'Medium' | 'Small'
  description: React.ReactNode
}

export function DonateFundingSources(props: DonateFundingSourcesProps) {
  const columnsConfig: ColumnConfig<DonateFundingSourceEntry>[] = [
    {
      name: 'Source / Project',
      headClassName: 'pl-4',
      getValue: (x) => <span className="pl-4">{x.source}</span>,
    },
    {
      name: 'Tier',
      getValue: (x) => x.tier,
    },
    {
      name: 'Description',
      getValue: (x) => x.description,
    },
  ]

  const rows: RowConfig<DonateFundingSourceEntry> = {
    getProps: (entry) => {
      return {
        href:
          entry.source === 'Open-source explorer for StarkEx deployments'
            ? 'https://dydx.l2beat.com'
            : undefined,
        className: 'cursor-auto',
      }
    },
  }

  return (
    <section id="funding-sources" className="mt-8">
      <a
        className="mb-6 text-2xl font-bold  md:text-4xl md:leading-normal"
        href="#funding-sources"
      >
        Funding sources
      </a>
      <div className="mt-4">
        As a public goods company, L2BEAT is financed in the open by the
        community. For transparency, we are providing L2BEAT’s funding sources
        below.
      </div>
      <div className="mt-4">
        <span>
          Those funding sources have been categorized based on the contribution
          amounts:
        </span>
        <ul className="mt-2 list-inside list-disc">
          <li>Significant: Above 500,000 USD</li>
          <li>Medium: Between 100,000 USD and 500,000 USD</li>
          <li>Small: Below 100.000 USD</li>
        </ul>
      </div>
      <TableView
        columnsConfig={columnsConfig}
        items={props.items}
        rows={rows}
      />
      <div className="mt-4">Last updated: November 2023</div>
    </section>
  )
}
