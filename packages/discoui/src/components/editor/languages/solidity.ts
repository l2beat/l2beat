import {
  foldService,
  StreamLanguage,
  type StringStream,
} from '@codemirror/language'
import type { EditorState } from '@codemirror/state'
import { indentWidth } from '../indentGuides'
import { keywords, typeNames } from './solidityWords'

interface SolidityState {
  inBlockComment: boolean
  inLineComment: boolean
}

const KEYWORDS = new Set(keywords)
const TYPE_NAMES = new Set(typeNames)
const OPERATORS = new Set([
  '+',
  '-',
  '*',
  '/',
  '%',
  '++',
  '--',
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
  '<<',
  '>>',
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
  '?',
  ':',
  '->',
])
const SYMBOL_CHARACTERS = '=><!~?:&|+-*/^%'
const BRACKET_CHARACTERS = '{}()[]'

const soliditySyntax = StreamLanguage.define<SolidityState>({
  name: 'solidity',
  startState: () => ({ inBlockComment: false, inLineComment: false }),
  copyState: (state) => ({ ...state }),
  token: readToken,
  blankLine: (state) => {
    state.inLineComment = false
  },
  languageData: {
    commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
    closeBrackets: { brackets: ['(', '[', '{', '"', "'"] },
  },
})

export const solidity = [soliditySyntax, foldService.of(foldByIndent)]

// Mirrors the Monarch tokenizer this replaced, quirks included, so code keeps
// its colors: a run of symbol characters is an operator only when the whole
// run is one, and only double quotes start a string.
function readToken(stream: StringStream, state: SolidityState): string | null {
  if (stream.sol()) {
    state.inLineComment = false
  }
  if (state.inBlockComment) {
    return readBlockComment(stream, state)
  }
  if (state.inLineComment) {
    return readLineComment(stream)
  }
  if (stream.eatSpace()) {
    return null
  }
  const character = stream.peek() as string
  if (isIdentifierStart(character)) {
    stream.eatWhile(isWordCharacter)
    return identifierStyle(stream.current())
  }
  if (stream.match('//')) {
    state.inLineComment = true
    return 'comment'
  }
  if (stream.match('/*')) {
    state.inBlockComment = true
    return 'comment'
  }
  if (BRACKET_CHARACTERS.includes(character)) {
    stream.next()
    return 'bracket'
  }
  if (SYMBOL_CHARACTERS.includes(character)) {
    stream.eatWhile((next) => SYMBOL_CHARACTERS.includes(next))
    return OPERATORS.has(stream.current()) ? 'operator' : null
  }
  if (character === ';') {
    stream.next()
    return 'punctuation'
  }
  if (readNumber(stream)) {
    return 'number'
  }
  if (character === '"') {
    readString(stream)
    return 'string'
  }
  stream.next()
  return null
}

function identifierStyle(word: string): string | null {
  if (KEYWORDS.has(word)) {
    return 'keyword'
  }
  if (TYPE_NAMES.has(word)) {
    return 'typeName'
  }
  return null
}

function readNumber(stream: StringStream): boolean {
  const start = stream.pos
  if (readFloat(stream)) {
    return true
  }
  stream.pos = start
  if (stream.match('0x') || stream.match('0X')) {
    if (stream.eatWhile(isHexDigitOrUnderscore)) {
      return true
    }
    stream.pos = start
  }
  return stream.eatWhile(isDigitOrUnderscore)
}

function readFloat(stream: StringStream): boolean {
  stream.eatWhile(isDigitOrUnderscore)
  if (!stream.eat('.') || !stream.eatWhile(isDigitOrUnderscore)) {
    return false
  }
  const exponentStart = stream.pos
  if (stream.eat('e') || stream.eat('E')) {
    stream.eat('-')
    if (!stream.eatWhile(isDigit)) {
      stream.pos = exponentStart
    }
  }
  return true
}

function readString(stream: StringStream) {
  stream.next()
  while (!stream.eol()) {
    const character = stream.next()
    if (character === '\\') {
      stream.next()
    } else if (character === '"') {
      return
    }
  }
}

function readLineComment(stream: StringStream): string {
  if (readAnnotation(stream)) {
    return 'annotation'
  }
  stream.next()
  stream.eatWhile((next) => next !== '@')
  return 'comment'
}

function readBlockComment(stream: StringStream, state: SolidityState): string {
  if (readAnnotation(stream)) {
    return 'annotation'
  }
  while (!stream.eol()) {
    if (stream.match('*/')) {
      state.inBlockComment = false
      return 'comment'
    }
    if (stream.peek() === '@') {
      return 'comment'
    }
    stream.next()
  }
  return 'comment'
}

// NatSpec tags like `@notice`.
function readAnnotation(stream: StringStream): boolean {
  const start = stream.pos
  if (stream.eat('@') && stream.eatWhile(isWordCharacter)) {
    return true
  }
  stream.pos = start
  return false
}

function isIdentifierStart(character: string): boolean {
  return isLetter(character) || character === '_'
}

function isWordCharacter(character: string): boolean {
  return isLetter(character) || isDigit(character) || character === '_'
}

function isLetter(character: string): boolean {
  return (
    (character >= 'a' && character <= 'z') ||
    (character >= 'A' && character <= 'Z')
  )
}

function isDigit(character: string): boolean {
  return character >= '0' && character <= '9'
}

function isDigitOrUnderscore(character: string): boolean {
  return isDigit(character) || character === '_'
}

function isHexDigitOrUnderscore(character: string): boolean {
  return (
    isDigitOrUnderscore(character) ||
    (character >= 'a' && character <= 'f') ||
    (character >= 'A' && character <= 'F')
  )
}

// Monaco folded Solidity by indentation, so this does too: a line folds the
// lines after it that are indented deeper, blank lines included.
function foldByIndent(
  state: EditorState,
  lineStart: number,
  lineEnd: number,
): { from: number; to: number } | null {
  const line = state.doc.lineAt(lineStart)
  const indent = indentWidth(line.text)
  if (indent === undefined) {
    return null
  }
  let lastLineNumber = line.number
  for (let number = line.number + 1; number <= state.doc.lines; number++) {
    const nextIndent = indentWidth(state.doc.line(number).text)
    if (nextIndent === undefined) {
      continue
    }
    if (nextIndent <= indent) {
      break
    }
    lastLineNumber = number
  }
  if (lastLineNumber === line.number) {
    return null
  }
  return { from: lineEnd, to: state.doc.line(lastLineNumber).to }
}
