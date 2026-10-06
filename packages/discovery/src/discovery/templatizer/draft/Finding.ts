/**
 * A check finding and the collector every rule writes into.
 *
 * Findings are the whole conversation between the checks and the model in
 * a repair round, so each carries the path of the offending value and a
 * message that states both what is wrong and what would be right. Every
 * finding blocks the draft: a check raises one only when the draft is
 * certainly wrong (it does not parse, V1's schema refuses it, it would
 * replace what the template or the baseline has, V1 refuses to construct or
 * run a field). What is merely worth a look is not a finding but a note
 * written into the template for the reviewer.
 */
export interface Finding {
  /** Path into the draft, e.g. `fields.sequencers.handler.add.where`. */
  path: string
  message: string
}

export class Findings {
  readonly list: Finding[] = []

  error(path: string, message: string): void {
    this.list.push({ path, message })
  }
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
