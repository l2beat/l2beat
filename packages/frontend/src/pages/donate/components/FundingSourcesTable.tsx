import { fundingSources } from '../DonatePage'

export function FundingSourcesTable() {
  return (
    <div className="mt-4 overflow-x-auto pb-3">
      <table>
        <thead>
          <tr className="h-8 border-divider border-b pt-2 pb-2.5 text-left font-medium text-[13px] text-primary">
            <th className="md:min-w-[300px] md:pl-4">Source / Project</th>
            <th className="md:pl-4">Tier</th>
            <th className="max-md:hidden md:pl-4">Description</th>
          </tr>
        </thead>
        <tbody>
          {fundingSources.map((item) => (
            <tr
              key={item.source}
              className="h-14 border-divider border-b text-base last:border-b-0"
            >
              <td className="py-2 pr-4 md:px-4">
                {item.source}
                <div className="mt-1 text-paragraph-14 text-secondary md:hidden">
                  {item.description}
                </div>
              </td>
              <td className="whitespace-nowrap py-2 align-top md:px-4 md:align-middle">
                {item.tier}
              </td>
              <td className="max-md:hidden md:px-4">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
