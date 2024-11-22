export function SmartAccountList({
  smartAccountUsage,
}: {
  smartAccountUsage: { signature: string; count: number }[]
}) {
  const sum = smartAccountUsage.reduce((acc, item) => acc + item.count, 0)

  return (
    <div className="m-10">
      <table className="w-full text-left text-gray-500 text-sm rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-gray-700 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Smart Account Signature
            </th>
            <th scope="col" className="px-6 py-3">
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {smartAccountUsage
            .sort((a, b) => b.count - a.count)
            .map((item) => {
              const percentage = (item.count / sum) * 100
              let percentageString = percentage.toFixed(0)

              if (percentage < 1) {
                percentageString = '< 1'
              }

              return (
                <tr
                  key={item.signature}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {item.signature}
                  </th>
                  <td className="px-6 py-2">
                    {item.count} ({percentageString}%)
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
