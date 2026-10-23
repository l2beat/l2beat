import { StreamLanguage, type StringStream } from '@codemirror/language'

interface JsonState {
  // One entry per open bracket: true for an object, false for an array.
  openObjects: boolean[]
  expectsKey: boolean
  inBlockComment: boolean
}

// JSON with comments, colored like Monaco's JSON tokens: keys apart from
// string values, and colons, commas and both kinds of brackets apart.
export const jsonSyntax = StreamLanguage.define<JsonState>({
  name: 'json',
  startState: () => ({
    openObjects: [],
    expectsKey: false,
    inBlockComment: false,
  }),
  copyState: (state) => ({ ...state, openObjects: [...state.openObjects] }),
  token: readToken,
  indent: (state, textAfter, context) => {
    const closes = textAfter.startsWith('}') || textAfter.startsWith(']')
    const depth = state.openObjects.length - (closes ? 1 : 0)
    return Math.max(depth, 0) * context.unit
  },
  languageData: {
    commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
    closeBrackets: { brackets: ['[', '{', '"'] },
    indentOnInput: { test: isClosingLine },
  },
})

function isClosingLine(text: string): boolean {
  const trimmed = text.trim()
  return trimmed === '}' || trimmed === ']'
}

function readToken(stream: StringStream, state: JsonState): string | null {
  if (state.inBlockComment) {
    readBlockComment(stream, state)
    return 'comment'
  }
  if (stream.eatSpace()) {
    return null
  }
  if (stream.match('//')) {
    stream.skipToEnd()
    return 'comment'
  }
  if (stream.match('/*')) {
    state.inBlockComment = true
    readBlockComment(stream, state)
    return 'comment'
  }
  const character = stream.next() as string
  if (character === '{' || character === '[') {
    state.openObjects.push(character === '{')
    state.expectsKey = character === '{'
    return character === '{' ? 'brace' : 'squareBracket'
  }
  if (character === '}' || character === ']') {
    state.openObjects.pop()
    state.expectsKey = false
    return character === '}' ? 'brace' : 'squareBracket'
  }
  if (character === ':') {
    state.expectsKey = false
    return 'definitionOperator'
  }
  if (character === ',') {
    state.expectsKey = state.openObjects[state.openObjects.length - 1] === true
    return 'separator'
  }
  if (character === '"') {
    readStringRest(stream)
    return state.expectsKey ? 'propertyName' : 'string'
  }
  if (character === '-' || isDigit(character)) {
    stream.eatWhile(isNumberCharacter)
    return 'number'
  }
  if (isLetter(character)) {
    stream.eatWhile(isLetter)
    const word = stream.current()
    if (word === 'true' || word === 'false') {
      return 'bool'
    }
    return word === 'null' ? 'null' : null
  }
  return null
}

function readStringRest(stream: StringStream) {
  while (!stream.eol()) {
    const character = stream.next()
    if (character === '\\') {
      stream.next()
    } else if (character === '"') {
      return
    }
  }
}

function readBlockComment(stream: StringStream, state: JsonState) {
  while (!stream.eol()) {
    if (stream.match('*/')) {
      state.inBlockComment = false
      return
    }
    stream.next()
  }
}

function isDigit(character: string): boolean {
  return character >= '0' && character <= '9'
}

function isNumberCharacter(character: string): boolean {
  return (
    isDigit(character) ||
    character === '.' ||
    character === 'e' ||
    character === 'E' ||
    character === '+' ||
    character === '-'
  )
}

function isLetter(character: string): boolean {
  return (
    (character >= 'a' && character <= 'z') ||
    (character >= 'A' && character <= 'Z')
  )
}
