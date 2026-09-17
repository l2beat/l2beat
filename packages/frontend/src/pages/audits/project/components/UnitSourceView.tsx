export function UnitSourceView({
  source,
  startLine,
}: {
  source: string
  startLine: number
}) {
  const lines = source.split('\n')
  return (
    <div className="max-h-[600px] overflow-auto rounded-md border border-divider bg-surface-primary font-mono text-xs">
      <table className="border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="align-top">
              <td className="w-12 min-w-12 select-none pr-3 text-right text-secondary">
                {startLine + i}
              </td>
              <td className="whitespace-pre pr-3">{line || ' '}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
