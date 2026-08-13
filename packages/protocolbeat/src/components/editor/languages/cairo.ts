import type { languages } from 'monaco-editor'

export const configuration: languages.LanguageConfiguration = {
  wordPattern:
    /(-?\d*\.\d\w*)|0[xX][0-9a-fA-F]+|([a-zA-Z_$][\w$]*)|([^\`\~\!\#\%\^\&\*\(\)\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: '//',
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

export const keywords = [
  // Declarations
  'fn',
  'mod',
  'use',
  'struct',
  'enum',
  'trait',
  'impl',
  'of',
  'const',
  'static',
  'type',
  'extern',
  'pub',

  // Control flow
  'if',
  'else',
  'loop',
  'while',
  'for',
  'in',
  'match',
  'return',
  'break',
  'continue',

  // Bindings and references
  'let',
  'mut',
  'ref',
  'as',

  // Values and self
  'true',
  'false',
  'Self',
  'self',
  'super',

  // Cairo-specific
  'nopanic',
  'implicits',

  // Common macros/idioms (highlighted as keywords for readability)
  'assert',
  'panic',
]

export const typeNames = [
  'felt252',
  'bool',
  'u8',
  'u16',
  'u32',
  'u64',
  'u128',
  'u256',
  'u512',
  'i8',
  'i16',
  'i32',
  'i64',
  'i128',
  'usize',
  'bytes31',
  'ByteArray',
  'ContractAddress',
  'ClassHash',
  'EthAddress',
  'StorageAddress',
  'StorageBaseAddress',
  'Array',
  'Span',
  'Option',
  'Result',
  'Felt252Dict',
  'NonZero',
  'Map',
  'Vec',
]

export const language: languages.IMonarchLanguage = {
  keywords,
  typeNames,
  operators: [
    '+',
    '-',
    '*',
    '/',
    '%',
    '==',
    '!=',
    '<',
    '<=',
    '>',
    '>=',
    '&&',
    '||',
    '!',
    '&',
    '|',
    '^',
    '~',
    '=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '?',
    ':',
    '.',
    '->',
    '=>',
    '@',
  ],
  symbols: /[=><!~?:&|+\-*\/\^%@]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // Attributes like #[starknet::interface] or #[derive(Drop, Serde)]
      [/#\[[^\]]*\]/, 'comment.keyword'],

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

      // whitespace and comments
      { include: '@whitespace' },

      // Operators
      [/[{}()\[\]]/, '@brackets'],
      [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
      [/;/, 'delimiter.semicolon'],

      // Numbers
      [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
      [/[0-9][0-9_]*/, 'number'],

      // Strings: double-quoted ByteArray and single-quoted short strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],
      [/'[^']*'/, 'string'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/"/, 'string', '@pop'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\//, 'comment', '@commentSingle'],
    ],

    commentSingle: [
      [/\@\w+$/, 'comment.keyword', '@pop'],
      [/\@\w+/, 'comment.keyword'],
      [/[^\@]*$/, 'comment', '@pop'],
      [/[^\@]+/, 'comment'],
    ],
  },
}
