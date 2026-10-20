import { EditorView } from '@codemirror/view'
import colors from '../../../colors.json'

// Monaco's dark diff colors.
const REMOVED_LINE = 'rgba(255, 0, 0, 0.2)'
const REMOVED_TEXT = 'rgba(255, 0, 0, 0.2)'
const INSERTED_LINE = 'rgba(155, 185, 85, 0.2)'
const INSERTED_TEXT = 'rgba(156, 204, 44, 0.2)'
const DIAGONAL_FILL = 'rgba(204, 204, 204, 0.2)'

const diagonalFill = {
  backgroundImage: `linear-gradient(-45deg, ${DIAGONAL_FILL} 12.5%, transparent 12.5%, transparent 50%, ${DIAGONAL_FILL} 50%, ${DIAGONAL_FILL} 62.5%, transparent 62.5%, transparent 100%)`,
  backgroundSize: '8px 8px',
}

export const diffTheme = EditorView.theme({
  '&.cm-merge-a .cm-changedLine': { backgroundColor: REMOVED_LINE },
  '&.cm-merge-b .cm-changedLine': { backgroundColor: INSERTED_LINE },
  '&.cm-merge-a .cm-changedText': { background: REMOVED_TEXT },
  '&.cm-merge-b .cm-changedText': { background: INSERTED_TEXT },
  '&.cm-merge-a .cm-changedLineGutter': { background: colors.aux.red },
  '&.cm-merge-b .cm-changedLineGutter': { background: colors.aux.green },
  '.cm-mergeSpacer, .cm-diff-gap': diagonalFill,
  '.cm-collapsedLines': {
    color: colors.coffee['400'],
    background: colors.coffee['800'],
    fontFamily: 'system-ui, sans-serif',
  },
  '.cm-collapsedLines:hover': { color: colors.coffee['200'] },
})
