import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { tags } from '@lezer/highlight'

const FONT_FAMILY =
  "ui-monospace, Menlo, Monaco, 'Cascadia Code', 'Source Code Pro', Consolas, 'DejaVu Sans Mono', monospace"
// Monaco's look on macOS: 12px text on 18px lines.
const FONT_SIZE = '12px'
const LINE_HEIGHT = '18px'
const editorTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      color: 'var(--color-coffee-200)',
      backgroundColor: 'var(--color-coffee-900)',
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': {
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE,
      lineHeight: LINE_HEIGHT,
    },
    '.cm-content': { caretColor: 'var(--color-coffee-200)' },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--color-coffee-200)',
    },
    '.cm-selectionBackground': { backgroundColor: 'var(--color-coffee-800)' },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground':
      { backgroundColor: 'var(--color-coffee-700)' },
    '.cm-activeLine': { backgroundColor: 'var(--editor-active-line)' },
    '.cm-selectionMatch': { backgroundColor: 'var(--editor-selection-match)' },
    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: 'var(--editor-bracket-match)',
      outline: '1px solid var(--color-coffee-600)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--color-coffee-900)',
      color: 'var(--color-coffee-400)',
      border: 'none',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      minWidth: '5ch',
      padding: '0 1ch 0 2ch',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--editor-active-line-number)',
    },
    '.cm-foldGutter .cm-gutterElement': {
      width: '2ch',
      cursor: 'pointer',
      opacity: '0',
      transition: 'opacity 0.2s',
    },
    '.cm-gutters:hover .cm-foldGutter .cm-gutterElement': { opacity: '1' },
    '.cm-foldPlaceholder': {
      backgroundColor: 'var(--color-coffee-700)',
      border: 'none',
      color: 'var(--color-coffee-200)',
      margin: '0 4px',
      padding: '0 4px',
    },
    '.cm-searchMatch': {
      backgroundColor: 'var(--editor-search-match)',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: 'var(--editor-search-match-selected)',
      outline: '1px solid var(--color-aux-orange)',
    },
    '.cm-panels': {
      backgroundColor: 'var(--color-coffee-800)',
      color: 'var(--color-coffee-200)',
    },
    '.cm-panels.cm-panels-top': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      height: '0',
      paddingRight: '14px',
      border: 'none',
      backgroundColor: 'transparent',
    },
    '.cm-panel.cm-find': {
      display: 'flex',
      gap: '2px',
      padding: '4px',
      backgroundColor: 'var(--color-coffee-800)',
      border: '1px solid var(--color-coffee-600)',
      borderTop: 'none',
      boxShadow: '0 2px 8px var(--editor-shadow)',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
    },
    '.cm-panel.cm-goto': {
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      width: '440px',
      maxWidth: '90%',
      padding: '6px',
      backgroundColor: 'var(--color-coffee-800)',
      border: '1px solid var(--color-coffee-600)',
      borderTop: 'none',
      boxShadow: '0 2px 8px var(--editor-shadow)',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
    },
    '.cm-goto .cm-find-box': { width: 'auto' },
    '.cm-goto-message': { padding: '0 2px', color: 'var(--color-coffee-400)' },
    '.cm-goto-target': { backgroundColor: 'var(--editor-goto-target)' },
    '.cm-textfield': {
      backgroundColor: 'var(--color-coffee-900)',
      border: '1px solid var(--color-coffee-600)',
      color: 'var(--color-coffee-200)',
    },
    '.cm-button': {
      backgroundImage: 'none',
      backgroundColor: 'var(--color-coffee-700)',
      border: '1px solid var(--color-coffee-600)',
      color: 'var(--color-coffee-200)',
    },
    '.cm-find-rows': {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    '.cm-find-row': {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
    },
    '.cm-find-row[hidden], .cm-find-button[hidden]': { display: 'none' },
    '.cm-find-box': {
      display: 'flex',
      alignItems: 'center',
      gap: '1px',
      width: '260px',
      height: '24px',
      padding: '0 2px 0 6px',
      backgroundColor: 'var(--color-coffee-900)',
      border: '1px solid var(--color-coffee-600)',
    },
    '.cm-find-box:focus-within': { borderColor: 'var(--color-coffee-400)' },
    '.cm-find-missing .cm-find-row:first-child .cm-find-box': {
      borderColor: 'var(--color-aux-red)',
    },
    '.cm-find-field': {
      flex: '1',
      minWidth: '0',
      padding: '0',
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--color-coffee-200)',
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE,
    },
    '.cm-find-field::placeholder': { color: 'var(--color-coffee-400)' },
    '.cm-find-toggle': {
      width: '20px',
      height: '18px',
      border: '1px solid transparent',
      color: 'var(--color-coffee-400)',
      fontFamily: FONT_FAMILY,
      fontSize: '11px',
      cursor: 'pointer',
    },
    '.cm-find-toggle:hover': { backgroundColor: 'var(--color-coffee-700)' },
    '.cm-find-toggle[aria-pressed=true]': {
      borderColor: 'var(--color-autumn-300)',
      backgroundColor:
        'color-mix(in oklab, var(--color-autumn-300) 20%, transparent)',
      color: 'var(--color-autumn-300)',
    },
    '.cm-find-counter': {
      minWidth: '72px',
      padding: '0 6px',
      color: 'var(--color-coffee-400)',
      whiteSpace: 'nowrap',
    },
    '.cm-find-missing .cm-find-counter': { color: 'var(--color-aux-red)' },
    '.cm-find-button': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '22px',
      height: '22px',
      color: 'var(--color-coffee-200)',
      cursor: 'pointer',
    },
    '.cm-find-button:hover, .cm-find-text-button:hover': {
      backgroundColor: 'var(--color-coffee-700)',
    },
    '.cm-find-expand': { height: 'auto', width: '16px' },
    '.cm-find-expand svg': { transition: 'transform 0.1s' },
    '.cm-find-expand[aria-expanded=true] svg': { transform: 'rotate(90deg)' },
    '.cm-find-text-button': {
      height: '22px',
      padding: '0 8px',
      color: 'var(--color-coffee-200)',
      cursor: 'pointer',
    },
    '.cm-tooltip': {
      backgroundColor: 'var(--color-coffee-800)',
      border: '1px solid var(--color-coffee-600)',
      color: 'var(--color-coffee-200)',
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      backgroundColor: 'var(--color-coffee-600)',
      color: 'var(--color-coffee-200)',
    },
    '.cm-completionDetail': { color: 'var(--color-coffee-400)' },
    '.cm-completionMatchedText': {
      color: 'var(--color-aux-yellow)',
      textDecoration: 'none',
    },
  },
  { dark: true },
)

const highlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: 'var(--color-coffee-400)' },
  { tag: tags.annotation, color: 'var(--color-aux-blue)' },
  { tag: tags.keyword, color: 'var(--color-aux-orange)' },
  { tag: tags.typeName, color: 'var(--color-aux-red)' },
  { tag: [tags.bracket, tags.punctuation], color: 'var(--color-coffee-400)' },
  { tag: tags.operator, color: 'var(--color-aux-green)', fontWeight: 'bold' },
  { tag: tags.number, color: 'var(--color-aux-teal)' },
  { tag: tags.string, color: 'var(--color-aux-yellow)' },
  { tag: tags.propertyName, color: 'var(--color-coffee-200)' },
  { tag: tags.squareBracket, color: 'var(--color-aux-green)' },
  { tag: tags.definitionOperator, color: 'var(--color-aux-pink)' },
  {
    tag: [tags.bool, tags.null],
    color: 'var(--color-aux-orange)',
    fontWeight: 'bold',
  },
])

export const theme = [editorTheme, syntaxHighlighting(highlightStyle)]
