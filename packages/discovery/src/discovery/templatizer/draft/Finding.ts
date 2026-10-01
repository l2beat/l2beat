/**
 * A check finding and the collector every rule writes into.
 *
 * Findings are the whole conversation between the checks and the model in
 * a repair round, so each carries the path of the offending value and a
 * message that states both what is wrong and what would be right. Warnings
 * never block a draft; they flag things worth a second look.
 */
export type Severity = 'error' | 'warning'

export interface Finding {
  severity: Severity
  /** Path into the draft, e.g. `fields.sequencers.handler.add.where`. */
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
    return hasErrors(this.list)
  }
}

export function hasErrors(findings: readonly Finding[]): boolean {
  return findings.some((finding) => finding.severity === 'error')
}

export function countErrors(findings: readonly Finding[]): number {
  return findings.filter((finding) => finding.severity === 'error').length
}

export function joinPath(base: string, child: string): string {
  if (base === '') {
    return child
  }
  return child.startsWith('[') ? `${base}${child}` : `${base}.${child}`
}

/** `fields.<name>` for identifiers, `fields["odd name"]` otherwise. */
export function fieldPath(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)
    ? `fields.${name}`
    : `fields[${JSON.stringify(name)}]`
}
