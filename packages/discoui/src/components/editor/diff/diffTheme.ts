import { EditorView } from '@codemirror/view'

const DIAGONAL_FILL = 'var(--diff-diagonal)'

const diagonalFill = {
  backgroundImage: `linear-gradient(-45deg, ${DIAGONAL_FILL} 12.5%, transparent 12.5%, transparent 50%, ${DIAGONAL_FILL} 50%, ${DIAGONAL_FILL} 62.5%, transparent 62.5%, transparent 100%)`,
  backgroundSize: '8px 8px',
}

export const diffTheme = EditorView.theme({
  '&.cm-merge-a .cm-changedLine': { backgroundColor: 'var(--diff-removed)' },
  '&.cm-merge-b .cm-changedLine': {
    backgroundColor: 'var(--diff-inserted-line)',
  },
  '&.cm-merge-a .cm-changedText': { background: 'var(--diff-removed)' },
  '&.cm-merge-b .cm-changedText': { background: 'var(--diff-inserted-text)' },
  '&.cm-merge-a .cm-changedLineGutter': { background: 'var(--color-aux-red)' },
  '&.cm-merge-b .cm-changedLineGutter': {
    background: 'var(--color-aux-green)',
  },
  '&.cm-merge-a .cm-changedLine.cm-filteredLine, &.cm-merge-b .cm-changedLine.cm-filteredLine':
    { backgroundColor: 'transparent' },
  '&.cm-merge-a .cm-filteredLine .cm-changedText, &.cm-merge-b .cm-filteredLine .cm-changedText':
    { background: 'none' },
  '&.cm-merge-a .cm-changedLineGutter.cm-filteredLine, &.cm-merge-b .cm-changedLineGutter.cm-filteredLine':
    { background: 'none' },
  '.cm-mergeSpacer': diagonalFill,
  '.cm-collapsedLines': {
    color: 'var(--color-coffee-400)',
    background: 'var(--color-coffee-800)',
    fontFamily: 'system-ui, sans-serif',
  },
  '.cm-collapsedLines:hover': { color: 'var(--color-coffee-200)' },
})
