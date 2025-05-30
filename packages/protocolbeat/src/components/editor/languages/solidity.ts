import type { languages } from 'monaco-editor'

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

export const keywords = [
  'if',
  'else',
  'for',
  'while',
  'do',
  'continue',
  'break',
  'return',
  'try',
  'catch',
  'throw',

  // Contract Structure
  'contract',
  'library',
  'interface',
  'struct',
  'enum',
  'error',
  'modifier',
  'event',
  'constructor',

  // Variable Declarations and Modifiers
  'constant',
  'immutable',
  'storage',
  'memory',
  'calldata',
  'public',
  'private',
  'internal',
  'external',
  'payable',
  'pure',
  'view',
  'virtual',
  'override',
  'abstract',
  'indexed',

  // Functions and Operators
  'new',
  'delete',
  'emit',
  'require',
  'assert',
  'revert',
  'selfdestruct',
  'type',
  'is',

  // Special Variables and Functions
  'msg',
  'tx',
  'block',
  'abi',
  'now',
  'super',
  'this',

  // Pragma and Imports
  'pragma',
  'import',
  'using',

  // Yul (inline assembly keywords)
  'assembly',
  'let',
  'function',
  'leave',
  'switch',
  'case',
  'default',
]

export const typeNames = [
  'bool',
  'address',
  'string',
  'bytes',
  'int',
  'int8',
  'int16',
  'int24',
  'int32',
  'int40',
  'int48',
  'int56',
  'int64',
  'int72',
  'int80',
  'int88',
  'int96',
  'int104',
  'int112',
  'int120',
  'int128',
  'int136',
  'int144',
  'int152',
  'int160',
  'int168',
  'int176',
  'int184',
  'int192',
  'int200',
  'int208',
  'int216',
  'int224',
  'int232',
  'int240',
  'int248',
  'int256',
  'uint',
  'uint8',
  'uint16',
  'uint24',
  'uint32',
  'uint40',
  'uint48',
  'uint56',
  'uint64',
  'uint72',
  'uint80',
  'uint88',
  'uint96',
  'uint104',
  'uint112',
  'uint120',
  'uint128',
  'uint136',
  'uint144',
  'uint152',
  'uint160',
  'uint168',
  'uint176',
  'uint184',
  'uint192',
  'uint200',
  'uint208',
  'uint216',
  'uint224',
  'uint232',
  'uint240',
  'uint248',
  'uint256',
  'fixed',
  'ufixed',
  'bytes1',
  'bytes2',
  'bytes3',
  'bytes4',
  'bytes5',
  'bytes6',
  'bytes7',
  'bytes8',
  'bytes9',
  'bytes10',
  'bytes11',
  'bytes12',
  'bytes13',
  'bytes14',
  'bytes15',
  'bytes16',
  'bytes17',
  'bytes18',
  'bytes19',
  'bytes20',
  'bytes21',
  'bytes22',
  'bytes23',
  'bytes24',
  'bytes25',
  'bytes26',
  'bytes27',
  'bytes28',
  'bytes29',
  'bytes30',
  'bytes31',
  'bytes32',
]

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
