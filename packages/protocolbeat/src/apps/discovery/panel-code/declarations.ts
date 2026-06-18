import type { ApiCodeSegment } from '../../../api/types'

export function joinDeclarations(declarations: ApiCodeSegment[]): string {
  return declarations.map((d) => d.content.trim()).join('\n\n')
}
