import type { editor } from 'monaco-editor'
import colors from '../../colors.json'

export const editorColoring: editor.IColors = {
  'editor.foreground': colors.coffee['200'],
  'editor.background': colors.coffee['900'],
  'editor.selectionBackground': colors.coffee['700'],
  'editor.inactiveSelectionBackground': colors.coffee['800'],
  'editorLineNumber.foreground': colors.coffee['600'],
  'editor.lineHighlightBackground': colors.coffee['800'],
  'editor.lineHighlightBorder': colors.coffee['800'],
  'editorIndentGuide.background1': colors.coffee['800'],
  'editorIndentGuide.activeBackground1': colors.coffee['600'],
}

/**
 * @see https://github.com/microsoft/monaco-editor/blob/main/src/language/json/tokenization.ts
 */
const jsonTokenColoringRules: editor.ITokenThemeRule[] = [
  { token: 'string.key.json', foreground: colors.coffee['200'] },
  { token: 'string.value.json', foreground: colors.aux.yellow },
  { token: 'number.json', foreground: colors.aux.teal },
  { token: 'keyword.json', foreground: colors.aux.orange, fontStyle: 'bold' },
  { token: 'delimiter.bracket.json', foreground: colors.coffee['400'] },
  { token: 'delimiter.array.json', foreground: colors.aux.green },
  { token: 'delimiter.colon.json', foreground: colors.aux.pink },
  { token: 'delimiter.comma.json', foreground: colors.coffee['400'] },
  { token: 'string.quote.json', foreground: colors.aux.cyan },
  { token: 'string.escape.json', foreground: colors.aux.red },
]

const solidityTokenColoringRules: editor.ITokenThemeRule[] = [
  { token: '', foreground: colors.coffee['200'] },
  { token: 'comment', foreground: colors.coffee['400'] },
  { token: 'comment.keyword', foreground: colors.aux.blue },
  { token: 'keyword', foreground: colors.aux.orange },
  { token: 'keyword.typename', foreground: colors.aux.red },
  { token: 'delimiter', foreground: colors.coffee['400'] },
  { token: 'operator', foreground: colors.aux.green, fontStyle: 'bold' },
  { token: 'number', foreground: colors.aux.teal },
  { token: 'string', foreground: colors.aux.yellow },
]

export const theme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [...jsonTokenColoringRules, ...solidityTokenColoringRules],
  colors: editorColoring,
}
