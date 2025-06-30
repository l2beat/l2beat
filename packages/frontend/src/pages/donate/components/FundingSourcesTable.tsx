import { fundingSources } from '../DonatePage'

export function FundingSourcesTable() {
  return (
    <div className="mt-4 overflow-x-auto pb-3">
      <table>
        <thead>
          <tr className="h-8 border-divider border-b pt-2 pb-2.5 text-left font-semibold text-[13px] text-zinc-500 uppercase tracking-[-0.13px] dark:text-secondary">
            <th className="min-w-[300px] md:pl-4">Source / Project</th>
            <th className="md:pl-4">Tier</th>
            <th className="md:pl-4">Description</th>
          </tr>
        </thead>
        <tbody>
          {fundingSources.map((item) => (
            <tr
              key={item.source}
              className="h-14 border-divider border-b text-base last:border-b-0"
            >
              <td className="pr-4 md:px-4">{item.source}</td>
              <td className="pr-4 md:px-4">{item.tier}</td>
              <td className="whitespace-pre pr-4 md:whitespace-normal md:px-4">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
