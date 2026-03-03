import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import type { CompiledReview } from '../../../../types'

interface CodeSectionProps {
  review: CompiledReview
}

interface Subsection {
  title: string
  content: ContentBlock[]
}

interface ContentBlock {
  type: string
  [key: string]: unknown
}

export function CodeSection({ review }: CodeSectionProps) {
  const section = review.sections?.codeAndAudits as
    | { title: string; subsections: Subsection[] }
    | undefined

  const { contracts } = review
  const internalContracts = contracts.filter((c) => !c.isExternal)
  const externalContracts = contracts.filter((c) => c.isExternal)
  const proxyContracts = internalContracts.filter((c) => c.proxyType)

  return (
    <div>
      <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
        {review.metadata.protocolName} consists of{' '}
        <span className="font-semibold text-text-primary">
          {internalContracts.length} internal contract
          {internalContracts.length !== 1 ? 's' : ''}
        </span>
        {externalContracts.length > 0 && (
          <>
            {' '}
            and{' '}
            <span className="font-semibold text-text-primary">
              {externalContracts.length} external contract
              {externalContracts.length !== 1 ? 's' : ''}
            </span>
          </>
        )}
        .{' '}
        {proxyContracts.length > 0
          ? `${proxyContracts.length} contract${proxyContracts.length !== 1 ? 's use' : ' uses'} proxy patterns, meaning their logic can potentially be upgraded.`
          : 'None of the contracts use proxy patterns, suggesting the code is immutable once deployed.'}
      </p>

      {/* Contract summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-text-primary">
            {internalContracts.length}
          </p>
          <p className="text-sm text-text-muted">Internal Contracts</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-text-primary">
            {proxyContracts.length}
          </p>
          <p className="text-sm text-text-muted">Upgradeable (Proxy)</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-text-primary">
            {externalContracts.length}
          </p>
          <p className="text-sm text-text-muted">External Contracts</p>
        </div>
      </div>

      {/* Proxy warning if applicable */}
      {proxyContracts.length > 0 && (
        <div className="rounded-xl border-l-4 border-status-amber/40 bg-status-amber/5 px-6 py-4 mb-8">
          <p className="text-sm font-semibold text-status-amber mb-1">
            Upgradeable contracts detected
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {proxyContracts.length} contract
            {proxyContracts.length !== 1 ? 's use' : ' uses'} proxy patterns (
            {[...new Set(proxyContracts.map((c) => c.proxyType))].join(', ')}
            ), which means their behavior can be changed by whoever controls the
            upgrade mechanism. Upgradeable contracts provide flexibility for bug
            fixes but introduce centralization risk.
          </p>
        </div>
      )}

      {/* Section content from review config */}
      {section?.subsections?.length ? (
        <div className="space-y-6">
          {section.subsections.map((sub) => (
            <div key={sub.title}>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {sub.title}
              </h3>
              <div className="space-y-3">
                {sub.content.map((block, i) => (
                  <ContentBlockRenderer
                    key={i}
                    block={block}
                    review={review}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Fallback: show contract table */
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Contract Inventory
          </h3>
          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Contract
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Address
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {internalContracts.map((c) => (
                  <tr
                    key={c.address}
                    className="border-b border-border last:border-0 hover:bg-bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2 text-text-primary font-medium">
                      {c.name}
                    </td>
                    <td className="px-4 py-2">
                      <AddressDisplay address={c.address} />
                    </td>
                    <td className="px-4 py-2">
                      {c.proxyType ? (
                        <Badge>{c.proxyType}</Badge>
                      ) : c.isGovernance ? (
                        <Badge variant="governance">Governance</Badge>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function ContentBlockRenderer({
  block,
  review,
}: {
  block: ContentBlock
  review: CompiledReview
}) {
  if (block.type === 'dataTable') {
    return <DataTableBlock block={block} review={review} />
  }

  if (block.type === 'text') {
    return (
      <p className="text-sm text-text-secondary leading-relaxed">
        {String(block.text ?? '')}
      </p>
    )
  }

  return null
}

function DataTableBlock({
  block,
  review,
}: {
  block: ContentBlock
  review: CompiledReview
}) {
  const columns = (block.columns ?? []) as {
    field: string
    header: string
    format?: string
  }[]
  const filters = block.filters as { excludeExternal?: boolean } | undefined

  let data: Record<string, unknown>[] = review.contracts.map(
    (c) => ({ ...c }) as Record<string, unknown>,
  )
  if (filters?.excludeExternal) {
    data = data.filter(
      (row) => !(row as { isExternal?: boolean }).isExternal,
    )
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-muted">
            {columns.map((col) => (
              <th
                key={col.field}
                className="text-left px-4 py-2 font-medium text-text-secondary"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-0 hover:bg-bg-muted/50"
            >
              {columns.map((col) => (
                <td key={col.field} className="px-4 py-2 text-text-primary">
                  {col.format === 'address' ? (
                    <span className="font-mono text-xs">
                      {String(row[col.field] ?? '')}
                    </span>
                  ) : col.format === 'badge' ? (
                    row[col.field] ? (
                      <Badge variant="purple">
                        {String(row[col.field])}
                      </Badge>
                    ) : (
                      <span className="text-text-muted">-</span>
                    )
                  ) : (
                    String(row[col.field] ?? '-')
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
