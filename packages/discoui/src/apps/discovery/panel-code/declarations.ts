import type { ApiCodeSegment } from '../../../api/types'

// Byte-exact: code search applies offsets computed on the original source to
// this editor content, so it must not be trimmed or reflowed.
export function joinDeclarations(declarations: ApiCodeSegment[]): string {
  let source = ''
  for (const declaration of declarations) {
    source += declaration.content
  }
  return source
}

export function joinSelectedDeclarations(
  declarations: ApiCodeSegment[],
  isSelected: (index: number) => boolean,
): string {
  const parts: string[] = []
  for (const [index, declaration] of declarations.entries()) {
    if (declaration.name === null || !isSelected(index)) {
      continue
    }
    parts.push(declaration.content.trim())
  }
  return parts.join('\n\n')
}

// The flattener emits the root contract last, after everything it uses.
export function findMainDeclarationOffset(
  declarations: ApiCodeSegment[],
): number | undefined {
  let offset = 0
  let mainOffset: number | undefined
  for (const declaration of declarations) {
    if (declaration.name !== null) {
      mainOffset = offset
    }
    offset += declaration.content.length
  }
  return mainOffset
}
