import type { editor } from 'monaco-editor'
import colors from '../colors.json'

export const theme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: colors.coffee['200'] },
    { token: 'comment', foreground: colors.coffee['400'] },
    { token: 'comment.keyword', foreground: colors.aux.blue },
    { token: 'keyword', foreground: colors.aux.orange },
    { token: 'keyword.typename', foreground: colors.aux.red },
    { token: 'delimiter', foreground: colors.coffee['400'] },
    { token: 'operator', foreground: colors.aux.green, fontStyle: 'bold' },
    { token: 'number', foreground: colors.aux.teal },
    { token: 'string', foreground: colors.aux.yellow },
  ],
  colors: {
    'editor.foreground': colors.coffee['200'],
    'editor.background': colors.coffee['900'],
    'editor.selectionBackground': colors.coffee['700'],
    'editor.inactiveSelectionBackground': colors.coffee['800'],
    'editorLineNumber.foreground': colors.coffee['600'],
    'editor.lineHighlightBackground': colors.coffee['800'],
    'editor.lineHighlightBorder': colors.coffee['800'],
    'editorIndentGuide.background1': colors.coffee['800'],
    'editorIndentGuide.activeBackground1': colors.coffee['600'],
  },
}
