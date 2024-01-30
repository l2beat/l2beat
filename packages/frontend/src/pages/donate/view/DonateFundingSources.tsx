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
    <section id="funding-sources" className="mt-16 md:mt-20">
      <div className="rounded-lg md:bg-gray-100 md:p-8 md:dark:bg-zinc-900">
        <a
          className="mb-6 text-2xl font-bold md:text-3xl md:leading-normal"
          href="#funding-sources"
        >
          Funding sources
        </a>
        <p className="mt-6 text-base">
          As a public goods company, L2BEAT is financed in the open by the
          community. For transparency, we are providing L2BEAT’s funding sources
          below.
        </p>
        <div className="mt-2 text-base leading-normal">
          <p>
            Those funding sources have been categorized based on the
            contribution amounts:
          </p>
          <ul className="ml-6 mt-2 list-disc">
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
      </div>
      <div className="mt-4 overflow-x-auto pb-3">
        <table>
          <thead>
            <tr className="h-14 border-b border-b-gray-200 text-left text-sm text-gray-50 dark:border-b-gray-800">
              <th className="min-w-[300px] md:pl-4">Source / Project</th>
              <th className="md:pl-4">Tier</th>
              <th className="md:pl-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, i) => {
              return (
                <tr
                  className="h-14 border-b border-b-gray-200 text-base last:border-b-0 dark:border-b-gray-800"
                  key={i}
                >
                  <td className="pr-4 md:px-4">{item.source}</td>
                  <td className="pr-4 md:px-4">{item.tier}</td>
                  <td className="whitespace-pre pr-4 md:whitespace-normal md:px-4">
                    {item.description}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 font-bold">Last updated: January 2024</div>
    </section>
  )
}
