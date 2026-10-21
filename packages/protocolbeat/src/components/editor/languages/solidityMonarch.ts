import type { languages } from 'monaco-editor/esm/vs/editor/editor.api'
import { keywords, typeNames } from './solidityWords'

export const configuration: languages.LanguageConfiguration = {
  wordPattern:
    /(-?\d*\.\d\w*)|0[xX][0-9a-fA-F]+|([a-zA-Z_$][\w$]*)|([^\`\~\!\#\%\^\&\*\(\)\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: "'", close: "'", notIn: ['string', 'comment'] },
    { open: '"', close: '"', notIn: ['string', 'comment'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: "'", close: "'" },
    { open: '"', close: '"' },
  ],
}

export const language: languages.IMonarchLanguage = {
  keywords,
  typeNames,
  operators: [
    // Arithmetic operators
    '+',
    '-',
    '*',
    '/',
    '%',
    '++',
    '--',

    // Comparison operators
    '==',
    '!=',
    '<',
    '<=',
    '>',
    '>=',

    // Logical operators
    '&&',
    '||',
    '!',

    // Bitwise operators
    '&',
    '|',
    '^',
    '~',
    '<<',
    '>>',

    // Assignment operators
    '=',
    ':=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '&=',
    '|=',
    '^=',
    '<<=',
    '>>=',

    // Conditional (ternary) operator
    '?',
    ':',

    // Member access operators
    '.',
    '->', // `->` used in Solidity's function selector syntax
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            '@keywords': { token: 'keyword.$0' },
            '@typeNames': { token: 'keyword.typename.$0' },
            '@default': 'identifier',
          },
        },
      ],

      // whitespace
      { include: '@whitespace' },

      // Operators
      [/[{}()\[\]]/, '@brackets'],
      [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
      [/;/, 'delimiter.semicolon'],

      // Numbers
      [/[0-9_]*\.[0-9_]+([eE]\-?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
      [/[0-9_]+/, 'number'],

      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, 'string', '@string'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/"/, 'string', '@pop'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\//, 'comment', '@commentSingle'],
      [/\/\*/, 'comment', '@commentMulti'],
    ],

    commentSingle: [
      [/\@\w+$/, 'comment.keyword', '@pop'],
      [/\@\w+/, 'comment.keyword'],
      [/[^\@]*$/, 'comment', '@pop'],
      [/[^\@]+/, 'comment'],
    ],

    commentMulti: [
      [/\@\w+/, 'comment.keyword'],
      [/[^\@\/*]+/, 'comment'],
      ['\\*/', 'comment', '@pop'],
      [/[\/*]/, 'comment'],
    ],
  },
}
