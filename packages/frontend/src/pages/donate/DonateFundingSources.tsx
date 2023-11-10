import React from 'react'

export interface DonateFundingSourcesProps {
  items: DonateFundingSourceEntry[]
}

interface DonateFundingSourceEntry {
  source: string
  tier: 'Significant' | 'Medium' | 'Small'
  description: React.ReactNode
}

export function DonateFundingSources(props: DonateFundingSourcesProps) {
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
          <li>
            <strong>Significant</strong>: Above 500,000 USD
          </li>
          <li>
            <strong>Medium</strong>: Between 100,000 USD and 500,000 USD
          </li>
          <li>
            <strong>Small</strong>: Below 100.000 USD
          </li>
        </ul>
      </div>
      <div className="mt-4 w-[calc(100%_+_32px)] overflow-x-auto md:w-[calc(100%_+_96px)]">
        <table>
          <thead>
            <tr className="h-14 border-b">
              <th className="min-w-[300px]">Source / Project</th>
              <th className="border-r border-l">Tier</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, i) => {
              return (
                <tr className="h-14 border-b last:border-b-0" key={i}>
                  <td className="px-4">{item.source}</td>
                  <td className="border-r border-l px-4 text-center">
                    {item.tier}
                  </td>
                  <td className="whitespace-pre pl-4 md:whitespace-normal">
                    {item.description}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 font-bold">Last updated: November 2023</div>
    </section>
  )
}
