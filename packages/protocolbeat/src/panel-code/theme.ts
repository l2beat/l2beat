import type { editor } from 'monaco-editor'

export const theme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: '#F0D8BD' },
    {
      token: 'comment',
      foreground: '#A98763',
    },
    {
      token: 'comment.keyword',
      foreground: '#8b8be8',
    },
    {
      token: 'keyword',
      foreground: '#fe8019',
    },
    {
      token: 'keyword.typename',
      foreground: '#fb4a35',
    },
    {
      token: 'delimiter',
      foreground: '#A98763',
    },
    {
      token: 'operator',
      foreground: '#EBDBB2',
      fontStyle: 'bold',
    },
    {
      token: 'number',
      foreground: '#83a599',
    },
    {
      token: 'string',
      foreground: '#fabd30',
    },
  ],
  colors: {
    'editor.foreground': '#F0D8BD',
    'editor.background': '#1d1816',
    'editor.selectionBackground': '#423731',
    'editor.inactiveSelectionBackground': '#2e2824',
    'editorLineNumber.foreground': '#594C43',
    'editor.lineHighlightBackground': '#2e2824',
    'editor.lineHighlightBorder': '#2e2824',
    'editorIndentGuide.background1': '#282422',
    'editorIndentGuide.activeBackground1': '#594C43',
  },
}
