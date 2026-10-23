import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { tags } from '@lezer/highlight'
import colors from '../../colors.json'

const FONT_FAMILY =
  "ui-monospace, Menlo, Monaco, 'Cascadia Code', 'Source Code Pro', Consolas, 'DejaVu Sans Mono', monospace"
// Monaco's look on macOS: 12px text on 18px lines.
const FONT_SIZE = '12px'
const LINE_HEIGHT = '18px'
const ACTIVE_LINE_NUMBER = '#c6c6c6'
// coffee-800 over coffee-900, translucent so the selection under it shows.
const ACTIVE_LINE = 'rgba(255, 255, 255, 0.05)'
const SELECTION_MATCH = 'rgba(173, 214, 255, 0.15)'
const BRACKET_MATCH = 'rgba(0, 100, 0, 0.3)'

const editorTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      color: colors.coffee['200'],
      backgroundColor: colors.coffee['900'],
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': {
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE,
      lineHeight: LINE_HEIGHT,
    },
    '.cm-content': { caretColor: colors.coffee['200'] },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: colors.coffee['200'] },
    '.cm-selectionBackground': { backgroundColor: colors.coffee['800'] },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground':
      { backgroundColor: colors.coffee['700'] },
    '.cm-activeLine': { backgroundColor: ACTIVE_LINE },
    '.cm-selectionMatch': { backgroundColor: SELECTION_MATCH },
    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: BRACKET_MATCH,
      outline: `1px solid ${colors.coffee['600']}`,
    },
    '.cm-gutters': {
      backgroundColor: colors.coffee['900'],
      color: colors.coffee['600'],
      border: 'none',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      minWidth: '5ch',
      padding: '0 1ch 0 2ch',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: ACTIVE_LINE_NUMBER,
    },
    '.cm-foldGutter .cm-gutterElement': {
      width: '2ch',
      cursor: 'pointer',
      opacity: '0',
      transition: 'opacity 0.2s',
    },
    '.cm-gutters:hover .cm-foldGutter .cm-gutterElement': { opacity: '1' },
    '.cm-foldPlaceholder': {
      backgroundColor: colors.coffee['700'],
      border: 'none',
      color: colors.coffee['200'],
      margin: '0 4px',
      padding: '0 4px',
    },
    '.cm-searchMatch': {
      backgroundColor: 'rgba(234, 92, 0, 0.33)',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: 'rgba(81, 92, 106, 1)',
      outline: `1px solid ${colors.aux.orange}`,
    },
    '.cm-panels': {
      backgroundColor: colors.coffee['800'],
      color: colors.coffee['200'],
    },
    '.cm-panels.cm-panels-top': {
      height: '0',
      border: 'none',
      backgroundColor: 'transparent',
    },
    '.cm-panel.cm-find': {
      position: 'absolute',
      top: '0',
      right: '14px',
      display: 'flex',
      gap: '2px',
      padding: '4px',
      backgroundColor: colors.coffee['800'],
      border: `1px solid ${colors.coffee['600']}`,
      borderTop: 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
    },
    '.cm-panel.cm-gotoLine': {
      position: 'absolute',
      top: '0',
      right: '14px',
      padding: '4px 8px',
      backgroundColor: colors.coffee['800'],
      border: `1px solid ${colors.coffee['600']}`,
      borderTop: 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
    },
    '.cm-textfield': {
      backgroundColor: colors.coffee['900'],
      border: `1px solid ${colors.coffee['600']}`,
      color: colors.coffee['200'],
    },
    '.cm-button': {
      backgroundImage: 'none',
      backgroundColor: colors.coffee['700'],
      border: `1px solid ${colors.coffee['600']}`,
      color: colors.coffee['200'],
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
      backgroundColor: colors.coffee['900'],
      border: `1px solid ${colors.coffee['600']}`,
    },
    '.cm-find-box:focus-within': { borderColor: colors.coffee['400'] },
    '.cm-find-missing .cm-find-row:first-child .cm-find-box': {
      borderColor: colors.aux.red,
    },
    '.cm-find-field': {
      flex: '1',
      minWidth: '0',
      padding: '0',
      background: 'none',
      border: 'none',
      outline: 'none',
      color: colors.coffee['200'],
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE,
    },
    '.cm-find-field::placeholder': { color: colors.coffee['400'] },
    '.cm-find-toggle': {
      width: '20px',
      height: '18px',
      border: '1px solid transparent',
      color: colors.coffee['400'],
      fontFamily: FONT_FAMILY,
      fontSize: '11px',
      cursor: 'pointer',
    },
    '.cm-find-toggle:hover': { backgroundColor: colors.coffee['700'] },
    '.cm-find-toggle[aria-pressed=true]': {
      borderColor: colors.autumn['300'],
      backgroundColor: 'rgba(186, 216, 10, 0.2)',
      color: colors.autumn['300'],
    },
    '.cm-find-counter': {
      minWidth: '72px',
      padding: '0 6px',
      color: colors.coffee['400'],
      whiteSpace: 'nowrap',
    },
    '.cm-find-missing .cm-find-counter': { color: colors.aux.red },
    '.cm-find-button': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '22px',
      height: '22px',
      color: colors.coffee['200'],
      cursor: 'pointer',
    },
    '.cm-find-button:hover, .cm-find-text-button:hover': {
      backgroundColor: colors.coffee['700'],
    },
    '.cm-find-expand': { height: 'auto', width: '16px' },
    '.cm-find-expand svg': { transition: 'transform 0.1s' },
    '.cm-find-expand[aria-expanded=true] svg': { transform: 'rotate(90deg)' },
    '.cm-find-text-button': {
      height: '22px',
      padding: '0 8px',
      color: colors.coffee['200'],
      cursor: 'pointer',
    },
    '.cm-tooltip': {
      backgroundColor: colors.coffee['800'],
      border: `1px solid ${colors.coffee['600']}`,
      color: colors.coffee['200'],
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      backgroundColor: colors.coffee['600'],
      color: colors.coffee['200'],
    },
    '.cm-completionDetail': { color: colors.coffee['400'] },
    '.cm-completionMatchedText': {
      color: colors.aux.yellow,
      textDecoration: 'none',
    },
  },
  { dark: true },
)

const highlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: colors.coffee['400'] },
  { tag: tags.annotation, color: colors.aux.blue },
  { tag: tags.keyword, color: colors.aux.orange },
  { tag: tags.typeName, color: colors.aux.red },
  { tag: [tags.bracket, tags.punctuation], color: colors.coffee['400'] },
  { tag: tags.operator, color: colors.aux.green, fontWeight: 'bold' },
  { tag: tags.number, color: colors.aux.teal },
  { tag: tags.string, color: colors.aux.yellow },
  { tag: tags.propertyName, color: colors.coffee['200'] },
  { tag: tags.squareBracket, color: colors.aux.green },
  { tag: tags.definitionOperator, color: colors.aux.pink },
  { tag: [tags.bool, tags.null], color: colors.aux.orange, fontWeight: 'bold' },
])

export const theme = [editorTheme, syntaxHighlighting(highlightStyle)]
