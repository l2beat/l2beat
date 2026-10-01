/**
 * A check finding and the collector every rule writes into.
 *
 * Findings are the whole conversation between the checks and the model in
 * a repair round, so each carries the path of the offending value and a
 * message that states both what is wrong and what would be right.
 *
 * Only an `error` blocks a draft, and a rule may raise one only when the
 * draft is certainly wrong: V1 would fail or silently do something else,
 * or the draft breaks the protocol (an item without a verdict). A rule
 * that is usually right but can be wrong raises an `advisory`: the model is
 * asked about it once and may keep its draft, and what still applies is
 * written into the template for the reviewer. Blocking on a judgment made
 * the model drop correct fields just to get past it. A `warning` is a hint
 * that travels only with errors.
 */
export type Severity = 'error' | 'advisory' | 'warning'

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

  advisory(path: string, message: string): void {
    this.list.push({ severity: 'advisory', path, message })
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

export function advisoriesOf(findings: readonly Finding[]): Finding[] {
  return findings.filter((finding) => finding.severity === 'advisory')
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
