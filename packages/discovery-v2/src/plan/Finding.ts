/**
 * A validator finding and the collector every rule writes into.
 *
 * Findings are the whole conversation between the validator and the model in
 * a repair round, so each carries the path of the offending value and a
 * message that states both what is wrong and what would be right. Warnings
 * never block a plan; they flag things the dry run will settle.
 */
export type Severity = 'error' | 'warning'

export interface Finding {
  severity: Severity
  /** JSON-pointer-like path into the plan, e.g. `steps[2].fetch.method`. */
  path: string
  message: string
}

export class Findings {
  readonly list: Finding[] = []

  error(path: string, message: string): void {
    this.list.push({ severity: 'error', path, message })
  }

  warning(path: string, message: string): void {
    this.list.push({ severity: 'warning', path, message })
  }

  hasErrors(): boolean {
    return this.list.some((finding) => finding.severity === 'error')
  }
}

export function joinPath(base: string, child: string): string {
  return child.startsWith('[') ? `${base}${child}` : `${base}.${child}`
}
