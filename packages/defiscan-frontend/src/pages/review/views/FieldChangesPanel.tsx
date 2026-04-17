import type { FieldChange } from '../../../types'
import { formatValue, humanizeFieldName } from './activityDescription'

/**
 * Inline expand panel for grouped data-change / role-update events.
 * Renders one row per FieldChange with columns Field | Before | After.
 *
 * For role-updates, the `roleName` prefix on each field key (e.g.
 * `accessControl.ADMIN.members`) is redundant with the badge/description
 * above, so we strip it and show the role-relative remainder (`members`).
 */
export function FieldChangesPanel({
  changes,
  roleName,
}: {
  changes: FieldChange[]
  roleName?: string
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border/60 bg-white">
      <table className="w-full text-[12px]">
        <thead className="bg-bg-card/60">
          <tr>
            <th className="w-[30%] px-3 py-2 text-left font-bold text-[10px] text-text-muted uppercase tracking-wider">
              Field
            </th>
            <th className="w-[35%] px-3 py-2 text-left font-bold text-[10px] text-text-muted uppercase tracking-wider">
              Before
            </th>
            <th className="w-[35%] px-3 py-2 text-left font-bold text-[10px] text-text-muted uppercase tracking-wider">
              After
            </th>
          </tr>
        </thead>
        <tbody>
          {changes.map((c, idx) => {
            const field = formatFieldLabel(c.field, roleName)
            const before = formatValue(c.before)
            const after = formatValue(c.after)
            return (
              <tr
                key={`${c.field}-${idx}`}
                className="border-border/40 border-t"
              >
                <td
                  className="break-all px-3 py-2 align-top font-mono text-text-primary"
                  title={c.field}
                >
                  {field}
                </td>
                <td
                  className="break-all px-3 py-2 align-top font-mono text-text-muted"
                  title={stringifyForTitle(c.before)}
                >
                  {before}
                </td>
                <td
                  className="break-all px-3 py-2 align-top font-mono text-text-primary"
                  title={stringifyForTitle(c.after)}
                >
                  {after}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function formatFieldLabel(field: string, roleName?: string): string {
  if (roleName) {
    // Strip `accessControl.<ROLE>.` prefix so the label is role-relative.
    const prefix = `accessControl.${roleName}.`
    if (field.startsWith(prefix)) return field.slice(prefix.length)
  }
  return humanizeFieldName(field)
}

function stringifyForTitle(value: unknown): string {
  if (value === undefined || value === null) return 'None'
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
