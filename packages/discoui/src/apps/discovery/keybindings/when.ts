import type { ParseResult } from './shortcut'

export const WHEN_CONTEXT_KEYS = [
  'inputFocus',
  'editorFocus',
  'nodesPanelActive',
  'searchOpen',
  'controlFocus',
] as const

export type WhenContextKey = (typeof WHEN_CONTEXT_KEYS)[number]
export type WhenContext = Readonly<Record<WhenContextKey, boolean>>

export const WHEN_CONTEXT_DESCRIPTIONS: Record<WhenContextKey, string> = {
  inputFocus: 'Focus is in a field that takes typing',
  editorFocus: 'Focus is in a code editor, read-only ones too',
  nodesPanelActive: 'The nodes panel is the active panel',
  searchOpen: 'The search dialog is open',
  controlFocus: 'Focus is on a button or link, which Space and Enter press',
}

type Operator = 'not' | 'and' | 'or'

// The clause compiles to postfix order, so evaluating it is one loop over a
// stack, with no recursion however deep the parentheses go.
type Instruction =
  | { readonly kind: 'context'; readonly key: WhenContextKey }
  | { readonly kind: Operator }

export interface WhenClause {
  readonly source: string
  readonly program: readonly Instruction[]
}

type Token =
  | { kind: 'identifier'; name: string }
  | { kind: 'operator'; operator: Operator }
  | { kind: 'open' }
  | { kind: 'close' }

const WHEN_SOURCE_LENGTH_MAX = 256

const PRECEDENCE: Record<Operator, number> = { not: 3, and: 2, or: 1 }

export function parseWhen(input: string): ParseResult<WhenClause> {
  const source = input.trim()
  if (source.length === 0) {
    return { success: false, message: 'Expression is empty' }
  }
  if (source.length > WHEN_SOURCE_LENGTH_MAX) {
    return { success: false, message: 'Expression is too long' }
  }
  const tokens = tokenize(source)
  if (!tokens.success) {
    return tokens
  }
  const program = compile(tokens.value)
  if (!program.success) {
    return program
  }
  return { success: true, value: { source, program: program.value } }
}

export function evaluateWhen(clause: WhenClause, context: WhenContext) {
  const stack: boolean[] = []
  for (const instruction of clause.program) {
    if (instruction.kind === 'context') {
      stack.push(context[instruction.key])
    } else if (instruction.kind === 'not') {
      stack.push(!popOperand(stack))
    } else {
      const right = popOperand(stack)
      const left = popOperand(stack)
      stack.push(instruction.kind === 'and' ? left && right : left || right)
    }
  }
  if (stack.length !== 1) {
    throw new Error('Malformed when clause program', {
      cause: { source: clause.source },
    })
  }
  return popOperand(stack)
}

function popOperand(stack: boolean[]): boolean {
  const value = stack.pop()
  if (value === undefined) {
    throw new Error('When clause stack underflow')
  }
  return value
}

function tokenize(source: string): ParseResult<Token[]> {
  const tokens: Token[] = []
  let index = 0
  while (index < source.length) {
    const rest = source.slice(index)
    const space = /^\s+/.exec(rest)
    const identifier = /^[A-Za-z][A-Za-z0-9]*/.exec(rest)
    if (space !== null) {
      index += space[0].length
    } else if (identifier !== null) {
      tokens.push({ kind: 'identifier', name: identifier[0] })
      index += identifier[0].length
    } else if (rest.startsWith('&&')) {
      tokens.push({ kind: 'operator', operator: 'and' })
      index += 2
    } else if (rest.startsWith('||')) {
      tokens.push({ kind: 'operator', operator: 'or' })
      index += 2
    } else if (rest.startsWith('!')) {
      tokens.push({ kind: 'operator', operator: 'not' })
      index += 1
    } else if (rest.startsWith('(')) {
      tokens.push({ kind: 'open' })
      index += 1
    } else if (rest.startsWith(')')) {
      tokens.push({ kind: 'close' })
      index += 1
    } else {
      return { success: false, message: `Unexpected "${rest[0]}"` }
    }
  }
  return { success: true, value: tokens }
}

// Shunting-yard. `expectOperand` tracks whether the next token must start an
// operand (a context, '!' or '('), which rejects "a b", "a &&" and "()".
function compile(tokens: Token[]): ParseResult<Instruction[]> {
  const output: Instruction[] = []
  const operators: (Operator | 'open')[] = []
  let expectOperand = true
  for (const token of tokens) {
    if (expectOperand) {
      if (token.kind === 'identifier') {
        const key = WHEN_CONTEXT_KEYS.find((key) => key === token.name)
        if (key === undefined) {
          return { success: false, message: `Unknown context "${token.name}"` }
        }
        output.push({ kind: 'context', key })
        expectOperand = false
      } else if (token.kind === 'operator' && token.operator === 'not') {
        operators.push('not')
      } else if (token.kind === 'open') {
        operators.push('open')
      } else {
        return { success: false, message: 'Expected a context' }
      }
    } else if (token.kind === 'operator' && token.operator !== 'not') {
      popOperatorsWhile(operators, output, PRECEDENCE[token.operator])
      operators.push(token.operator)
      expectOperand = true
    } else if (token.kind === 'close') {
      popOperatorsWhile(operators, output, 0)
      if (operators.pop() !== 'open') {
        return { success: false, message: 'Unmatched ")"' }
      }
    } else {
      return { success: false, message: 'Expected "&&", "||" or ")"' }
    }
  }
  if (expectOperand) {
    return { success: false, message: 'Expression ends early' }
  }
  popOperatorsWhile(operators, output, 0)
  if (operators.length > 0) {
    return { success: false, message: 'Unmatched "("' }
  }
  return { success: true, value: output }
}

// Binary operators are left-associative, so an operator of equal precedence
// already on the stack is applied first.
function popOperatorsWhile(
  operators: (Operator | 'open')[],
  output: Instruction[],
  precedenceMin: number,
) {
  for (;;) {
    const top = operators.at(-1)
    if (
      top === undefined ||
      top === 'open' ||
      PRECEDENCE[top] < precedenceMin
    ) {
      return
    }
    operators.pop()
    output.push({ kind: top })
  }
}
