import { assert } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

// Permission descriptions are opaque to clingo: the rules only carry them from
// a permission fact to the matching ultimatePermission. Sending a short id
// instead keeps them out of the program, whose size is capped by clingo-wasm,
// and the text is joined back when the output is parsed.
export class DescriptionTable {
  private readonly textById = new Map<string, string>()

  intern(text: string): string {
    const id = descriptionId(text)
    const known = this.textById.get(id)
    if (known !== undefined) {
      assert(known === text, `Description id collision on ${id}`)
      return id
    }
    this.textById.set(id, text)
    return id
  }

  resolve(id: string): string {
    const text = this.textById.get(id)
    assert(text !== undefined, `Unknown description id ${id}`)
    return text
  }
}

// Content addressed so the id of a description does not depend on which
// cluster it was generated in, and the per project clingo hash stays stable.
// Six hash bytes are eight base64url chars. Clingo identifiers cannot contain
// a dash, so it is folded into the underscore.
function descriptionId(text: string): string {
  const hash = createHash('sha256').update(text).digest()
  return 'd_' + hash.subarray(0, 6).toString('base64url').replaceAll('-', '_')
}
