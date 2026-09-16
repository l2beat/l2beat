import {
  Node,
  Project,
  type PropertyAccessExpression,
  type SourceFile,
} from 'ts-morph'

export interface Finding {
  line: number
  column: number
  snippet: string
  note: string
}

export interface TransformResult {
  text: string
  /** earl/mocha constructs still in the output, which a human has to finish. */
  blockers: Finding[]
  /** Rewrites that changed meaning slightly and deserve a second look. */
  reviews: Finding[]
  /** The file now depends on `@l2beat/test-utils`, for a helper or a matcher. */
  usesTestUtils: boolean
}

/**
 * Rewrites one earl + mocha test file to vitest.
 *
 * Every rewrite is expressed as a replacement of a small, leaf-level range of
 * the original text (usually just a method name) so that the surrounding code -
 * including anything the codemod does not understand - survives byte for byte.
 */
export function transformTestFile(
  fileName: string,
  text: string,
): TransformResult {
  const file = parse(fileName, text)
  const context: Context = {
    edits: [],
    reviews: [],
    needed: new Set<string>(),
    mockVariables: collectMockVariables(file),
    shadowed: collectShadowedNames(file),
    usesCustomMatchers: false,
  }

  file.forEachDescendant((node) => {
    if (Node.isIdentifier(node)) {
      rewriteGlobal(node, context)
    } else if (Node.isCallExpression(node)) {
      const callee = node.getExpression()
      if (Node.isPropertyAccessExpression(callee)) {
        rewriteMethodCall(node.getArguments(), callee, node.getEnd(), context)
      }
    } else if (Node.isPropertyAccessExpression(node)) {
      rewriteRecordedCalls(node, context)
    }
  })

  collectUsedRunnerApi(file, context)
  context.edits.push(...rewriteImports(file, context.needed))

  const output = applyEdits(text, context.edits)
  return {
    text: output,
    blockers: findLeftovers(output),
    reviews: context.reviews,
    usesTestUtils:
      context.usesCustomMatchers || output.includes(TEST_UTILS_PACKAGE),
  }
}

interface Edit {
  start: number
  end: number
  text: string
}

interface Context {
  edits: Edit[]
  reviews: Finding[]
  needed: Set<string>
  mockVariables: Set<string>
  /** Names the file declares itself, which vitest must not be imported over. */
  shadowed: Set<string>
  usesCustomMatchers: boolean
}

function rewriteGlobal(node: Node, context: Context): void {
  const name = node.getText()
  // `mockFn` also shows up in type positions, as `ReturnType<typeof mockFn>`.
  if (name === 'mockFn' && isValueReference(node)) {
    context.edits.push(replace(node, 'vi.fn'))
    context.needed.add('vi')
    return
  }
  const hook = lookup(MOCHA_HOOKS, name)
  if (hook && isCallee(node) && !context.shadowed.has(name)) {
    context.edits.push(replace(node, hook))
    context.needed.add(hook)
  }
}

function rewriteMethodCall(
  args: Node[],
  callee: PropertyAccessExpression,
  callEnd: number,
  context: Context,
): void {
  const receiver = callee.getExpression()
  const method = callee.getName()
  const nameNode = callee.getNameNode()

  if (Node.isIdentifier(receiver) && receiver.getText() === 'expect') {
    rewriteAsymmetricMatcher(method, nameNode, args, callEnd, context)
    return
  }
  if (rootIdentifier(callee) === 'expect') {
    rewriteMatcher(method, nameNode, receiver, args, callEnd, context)
    return
  }
  rewriteMockChain(method, nameNode, receiver, args, context)
}

function rewriteMockChain(
  method: string,
  nameNode: Node,
  receiver: Node,
  args: Node[],
  context: Context,
): void {
  if (AMBIGUOUS_MOCK_CHAIN.has(method) && !isMockReceiver(receiver, context)) {
    return
  }
  const renamed = lookup(MOCK_CHAIN, method)
  if (renamed) {
    context.edits.push(replace(nameNode, renamed))
    return
  }
  const throwing = lookup(THROWING_MOCK_CHAIN, method)
  const error = args[0]
  if (throwing && error) {
    context.edits.push(replace(nameNode, throwing))
    context.edits.push(replace(error, `() => { throw ${error.getText()} }`))
  }
}

/**
 * earl records a call as `{ args }` under `mock.calls`; vitest records the
 * arguments themselves under `mock.mock.calls`, so the `.args` hop disappears.
 */
function rewriteRecordedCalls(
  node: PropertyAccessExpression,
  context: Context,
): void {
  if (node.getName() !== 'calls') {
    return
  }
  const args = recordedArgsAccess(node)
  const isMockCalls =
    args !== undefined || isMockReceiver(node.getExpression(), context)
  if (!isMockCalls) {
    return
  }
  context.edits.push(replace(node.getNameNode(), 'mock.calls'))
  if (args) {
    context.edits.push(span(args.getExpression().getEnd(), args.getEnd(), ''))
  }
}

/** Matches the `.calls[i].args`, `.calls[i]?.args` and `.calls[i]!.args` that
 * make up almost every read of an earl mock's history. */
function recordedArgsAccess(
  calls: PropertyAccessExpression,
): PropertyAccessExpression | undefined {
  const indexed = calls.getParent()
  if (!Node.isElementAccessExpression(indexed)) {
    return undefined
  }
  const asserted = indexed.getParent()
  const access = Node.isNonNullExpression(asserted)
    ? asserted.getParent()
    : asserted
  if (Node.isPropertyAccessExpression(access) && access.getName() === 'args') {
    return access
  }
  return undefined
}

function rewriteMatcher(
  method: string,
  nameNode: Node,
  receiver: Node,
  args: Node[],
  callEnd: number,
  context: Context,
): void {
  const renamed = lookup(RENAMED_MATCHERS, method)
  if (renamed) {
    context.edits.push(replace(nameNode, renamed))
    return
  }
  switch (method) {
    case 'toEqualUnsorted':
      context.usesCustomMatchers = true
      return
    case 'toBeEmpty':
      context.edits.push(span(nameNode.getStart(), callEnd, 'toHaveLength(0)'))
      return
    case 'toBeA':
      rewriteToBeA(nameNode, args, callEnd, context)
      return
    case 'toBeNullish':
      rewriteToBeNullish(receiver, callEnd, context)
      return
    case 'toInclude':
      rewriteToInclude(nameNode, args, context)
      return
    case 'toThrow':
      if (args.length === 2) {
        context.edits.push(replace(nameNode, 'toThrowWithMessage'))
        context.usesCustomMatchers = true
      }
      return
    case 'toBeRejectedWith':
      if (args.length === 2) {
        context.edits.push(replace(nameNode, 'rejects.toThrowWithMessage'))
        context.usesCustomMatchers = true
      } else {
        context.edits.push(replace(nameNode, 'rejects.toThrow'))
      }
      return
    case 'toBeRejected':
      context.edits.push(replace(nameNode, 'rejects.toThrow'))
      return
    case 'toBeCloseTo':
      if (args.length === 2) {
        context.reviews.push(
          finding(
            nameNode,
            "earl's second argument is an epsilon, vitest's is a number of digits",
          ),
        )
      }
      return
    case 'toMatchSnapshot':
      context.reviews.push(
        finding(
          nameNode,
          'earl and vitest store snapshots differently, regenerate them',
        ),
      )
      return
    default:
      return
  }
}

function rewriteToBeA(
  nameNode: Node,
  args: Node[],
  callEnd: number,
  context: Context,
): void {
  const type = args[0]?.getText()
  if (!type) {
    return
  }
  const primitive = lookup(PRIMITIVE_CONSTRUCTORS, type)
  const replacement = primitive
    ? `toBeTypeOf('${primitive}')`
    : `toBeInstanceOf(${type})`
  context.edits.push(span(nameNode.getStart(), callEnd, replacement))
}

/** earl's `toBeNullish` has no vitest counterpart, so the nullishness check
 * moves into the subject: `expect(x).toBeNullish()` becomes
 * `expect(x == null).toBe(true)`, which keeps `null | undefined` exact where
 * `toBeFalsy` would also accept `0` and `''`. */
function rewriteToBeNullish(
  receiver: Node,
  callEnd: number,
  context: Context,
): void {
  const negated =
    Node.isPropertyAccessExpression(receiver) && receiver.getName() === 'not'
  const expectCall = negated
    ? (receiver as PropertyAccessExpression).getExpression()
    : receiver
  const subject = Node.isCallExpression(expectCall)
    ? expectCall.getArguments()[0]
    : undefined
  if (!subject) {
    return
  }
  context.edits.push(span(subject.getEnd(), subject.getEnd(), ' == null'))
  context.edits.push(
    span(expectCall.getEnd(), callEnd, `.toBe(${negated ? 'false' : 'true'})`),
  )
}

/** `toContain` compares with `Object.is`, which only matches earl for
 * primitives, so anything else falls back to the deep `toContainEqual`. */
function rewriteToInclude(
  nameNode: Node,
  args: Node[],
  context: Context,
): void {
  const item = args[0]
  if (args.length !== 1 || !item) {
    return
  }
  if (isPrimitiveLiteral(item)) {
    context.edits.push(replace(nameNode, 'toContain'))
    return
  }
  context.edits.push(replace(nameNode, 'toContainEqual'))
  context.reviews.push(
    finding(
      nameNode,
      'chose toContainEqual, switch to toContain if the subject is a string',
    ),
  )
}

function rewriteAsymmetricMatcher(
  method: string,
  nameNode: Node,
  args: Node[],
  callEnd: number,
  context: Context,
): void {
  const item = args[0]
  switch (method) {
    case 'a':
      context.edits.push(replace(nameNode, 'any'))
      return
    case 'subset':
      context.edits.push(replace(nameNode, 'objectContaining'))
      context.reviews.push(
        finding(
          nameNode,
          "earl's subset is recursive, objectContaining is not",
        ),
      )
      return
    case 'includes':
      if (item) {
        context.edits.push(
          span(
            nameNode.getStart(),
            callEnd,
            `arrayContaining([${item.getText()}])`,
          ),
        )
      }
      return
    case 'anything':
      context.reviews.push(
        finding(
          nameNode,
          "earl's anything() also matches null and undefined, vitest's does not",
        ),
      )
      return
    default:
      return
  }
}

function rewriteImports(file: SourceFile, needed: Set<string>): Edit[] {
  const superseded = file
    .getImportDeclarations()
    .filter((d) => SUPERSEDED_MODULES.has(d.getModuleSpecifierValue()))
  const earlNames = superseded
    .filter((d) => d.getModuleSpecifierValue() === 'earl')
    .flatMap((d) => d.getNamedImports().map((n) => n.getName()))
  const lines: string[] = []
  const runnerApi = RUNNER_API.filter((name) => needed.has(name))
  if (runnerApi.length > 0) {
    lines.push(`import { ${runnerApi.join(', ')} } from 'vitest'`)
  }
  const helpers = [
    earlNames.includes('MockObject') ? 'type MockObject' : undefined,
    earlNames.includes('mockObject') ? 'mockObject' : undefined,
  ].filter((name) => name !== undefined)
  if (helpers.length > 0) {
    lines.push(`import { ${helpers.join(', ')} } from '${TEST_UTILS_PACKAGE}'`)
  }

  const [anchor, ...rest] = superseded
  if (anchor) {
    return [
      ...rest.map((d) => span(d.getStart(), d.getEnd(), '')),
      span(anchor.getStart(), anchor.getEnd(), lines.join('\n')),
    ]
  }
  const first = file.getStatements()[0]
  if (!first || lines.length === 0) {
    return []
  }
  return [span(first.getStart(), first.getStart(), `${lines.join('\n')}\n`)]
}

function collectUsedRunnerApi(file: SourceFile, context: Context): void {
  file.forEachDescendant((node) => {
    const name = Node.isIdentifier(node) ? node.getText() : undefined
    if (!name || !RUNNER_API.includes(name) || context.shadowed.has(name)) {
      return
    }
    if (isValueReference(node)) {
      context.needed.add(name)
    }
  })
}

/** Test files really do declare things called `before`, `after` and `test`;
 * importing vitest's version on top of them would not compile. */
function collectShadowedNames(file: SourceFile): Set<string> {
  const names = new Set<string>()
  file.forEachDescendant((node) => {
    if (
      Node.isVariableDeclaration(node) ||
      Node.isFunctionDeclaration(node) ||
      Node.isClassDeclaration(node)
    ) {
      const name = node.getName()
      if (name) {
        names.add(name)
      }
    }
  })
  for (const declaration of file.getImportDeclarations()) {
    if (SUPERSEDED_MODULES.has(declaration.getModuleSpecifierValue())) {
      continue
    }
    for (const specifier of declaration.getNamedImports()) {
      names.add(specifier.getAliasNode()?.getText() ?? specifier.getName())
    }
    const defaultImport = declaration.getDefaultImport()
    if (defaultImport) {
      names.add(defaultImport.getText())
    }
  }
  return names
}

function isValueReference(node: Node): boolean {
  const parent = node.getParent()
  if (!parent) {
    return false
  }
  if (Node.isPropertyAccessExpression(parent)) {
    return parent.getNameNode() !== node
  }
  return !(
    Node.isImportSpecifier(parent) ||
    Node.isImportClause(parent) ||
    Node.isPropertyAssignment(parent) ||
    Node.isBindingElement(parent) ||
    Node.isVariableDeclaration(parent) ||
    Node.isParameterDeclaration(parent) ||
    Node.isFunctionDeclaration(parent) ||
    Node.isQualifiedName(parent)
  )
}

/** Names that hold a mock, so that `x.returns(...)` can be told apart from a
 * method that happens to be called `returns`. */
function collectMockVariables(file: SourceFile): Set<string> {
  const names = new Set<string>()
  file.forEachDescendant((node) => {
    if (!Node.isVariableDeclaration(node)) {
      return
    }
    const initializer = node.getInitializer()
    const root = initializer ? rootIdentifier(initializer) : undefined
    const declaredType = node.getTypeNode()?.getText() ?? ''
    if (
      root === 'mockFn' ||
      root === 'mockObject' ||
      declaredType.startsWith('MockObject<')
    ) {
      names.add(node.getName())
    }
  })
  return names
}

function isMockReceiver(receiver: Node, context: Context): boolean {
  const root = rootIdentifier(receiver)
  return (
    root === 'mockFn' || (root !== undefined && context.mockVariables.has(root))
  )
}

function rootIdentifier(node: Node): string | undefined {
  let current: Node | undefined = node
  while (current) {
    if (Node.isIdentifier(current)) {
      return current.getText()
    }
    if (
      Node.isPropertyAccessExpression(current) ||
      Node.isCallExpression(current) ||
      Node.isElementAccessExpression(current) ||
      Node.isNonNullExpression(current) ||
      Node.isParenthesizedExpression(current) ||
      Node.isAwaitExpression(current)
    ) {
      current = current.getExpression()
      continue
    }
    return undefined
  }
  return undefined
}

/** Plain property access would happily resolve `toString` or `constructor`
 * through `Object.prototype` and rewrite unrelated code. */
function lookup(
  table: Record<string, string>,
  key: string,
): string | undefined {
  return Object.hasOwn(table, key) ? table[key] : undefined
}

function isCallee(node: Node): boolean {
  const parent = node.getParent()
  return Node.isCallExpression(parent) && parent.getExpression() === node
}

function isPrimitiveLiteral(node: Node): boolean {
  return (
    Node.isStringLiteral(node) ||
    Node.isNoSubstitutionTemplateLiteral(node) ||
    Node.isNumericLiteral(node) ||
    Node.isTrueLiteral(node) ||
    Node.isFalseLiteral(node)
  )
}

function replace(node: Node, text: string): Edit {
  return span(node.getStart(), node.getEnd(), text)
}

function span(start: number, end: number, text: string): Edit {
  return { start, end, text }
}

function finding(node: Node, note: string): Finding {
  const file = node.getSourceFile()
  const { line, column } = file.getLineAndColumnAtPos(node.getStart())
  return {
    line,
    column,
    snippet: lineAt(file.getFullText(), line),
    note,
  }
}

function applyEdits(text: string, edits: Edit[]): string {
  const ordered = [...edits].sort((a, b) => b.start - a.start || b.end - a.end)
  let output = text
  let lowestTouched = Number.POSITIVE_INFINITY
  for (const edit of ordered) {
    if (edit.end > lowestTouched) {
      throw new Error(`Overlapping rewrites at offset ${edit.start}`)
    }
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end)
    lowestTouched = edit.start
  }
  return output
}

function findLeftovers(output: string): Finding[] {
  const findings: Finding[] = []
  const lines = output.split('\n')
  for (const [index, text] of lines.entries()) {
    for (const [pattern, note] of LEFTOVERS) {
      const match = pattern.exec(text)
      if (match) {
        findings.push({
          line: index + 1,
          column: match.index + 1,
          snippet: text.trim(),
          note,
        })
        break
      }
    }
  }
  return findings
}

function lineAt(text: string, line: number): string {
  return (text.split('\n')[line - 1] ?? '').trim()
}

function parse(fileName: string, text: string): SourceFile {
  return project.createSourceFile(`${fileName}.codemod.ts`, text, {
    overwrite: true,
  })
}

const project = new Project({
  useInMemoryFileSystem: true,
  skipAddingFilesFromTsConfig: true,
})

const TEST_UTILS_PACKAGE = '@l2beat/test-utils'

/** Modules vitest replaces outright: whatever a file imported from these, it
 * now imports from `vitest` or `@l2beat/test-utils`. Files that spell out
 * `import { describe } from 'mocha'` are the reason this is not just `earl` -
 * left alone, that import would shadow the vitest one and survive the
 * migration. */
const SUPERSEDED_MODULES = new Set(['earl', 'mocha', 'vitest'])

const RUNNER_API = [
  'afterAll',
  'afterEach',
  'beforeAll',
  'beforeEach',
  'describe',
  'expect',
  'it',
  'test',
  'vi',
]

/** Mocha's `before`/`after` run once per suite, like vitest's `*All` hooks. */
const MOCHA_HOOKS: Record<string, string> = {
  before: 'beforeAll',
  after: 'afterAll',
}

const MOCK_CHAIN: Record<string, string> = {
  executes: 'mockImplementation',
  executesOnce: 'mockImplementationOnce',
  rejectsWith: 'mockRejectedValue',
  rejectsWithOnce: 'mockRejectedValueOnce',
  resolvesTo: 'mockResolvedValue',
  resolvesToOnce: 'mockResolvedValueOnce',
  returns: 'mockReturnValue',
  returnsOnce: 'mockReturnValueOnce',
}

const THROWING_MOCK_CHAIN: Record<string, string> = {
  throws: 'mockImplementation',
  throwsOnce: 'mockImplementationOnce',
}

/** These read as ordinary method names, so they are only rewritten when the
 * receiver is known to hold a mock. */
const AMBIGUOUS_MOCK_CHAIN = new Set(['executes', 'returns', 'throws'])

/** See the header of scripts/migrate-to-vitest.ts for why `toEqual` tightens
 * into `toStrictEqual`. */
const RENAMED_MATCHERS: Record<string, string> = {
  toEqual: 'toStrictEqual',
  toExactlyEqual: 'toBe',
  toHaveBeenOnlyCalledWith: 'toHaveBeenCalledExactlyOnceWith',
  toHaveSubset: 'toMatchObject',
  toLooseEqual: 'toEqual',
  toMatchRegex: 'toMatch',
}

const PRIMITIVE_CONSTRUCTORS: Record<string, string> = {
  BigInt: 'bigint',
  Boolean: 'boolean',
  Function: 'function',
  Number: 'number',
  String: 'string',
  Symbol: 'symbol',
}

const LEFTOVERS: [RegExp, string][] = [
  [/from 'earl'/, 'earl import left in place'],
  [/from 'mocha'/, 'mocha import left in place'],
  [
    /@sinonjs\/fake-timers/,
    'sinon fake timers - use vi.useFakeTimers() and vi.advanceTimersByTime()',
  ],
  [/\bmockFn\b/, 'earl mockFn - replace with vi.fn()'],
  [
    /\.given\(/,
    'earl given() has no vitest equivalent - use mockImplementation',
  ],
  [
    /(?<!\.mock)\.calls\b/,
    'earl mock call history - vitest spells it mock.mock.calls',
  ],
  [/\b(isExhausted|toHaveBeenExhausted)\(/, 'earl-only mock assertion'],
  [
    /\.(resolvesTo|resolvesToOnce|rejectsWith|rejectsWithOnce|returnsOnce|executesOnce|throwsOnce)\(/,
    'earl mock chain method',
  ],
  [
    /\.(returns|executes|throws)\(/,
    'possible earl mock chain method on an unrecognised receiver',
  ],
  [
    /\.(toBeA|toInclude|toHaveSubset|toBeNullish|toExactlyEqual|toMatchRegex|toBeEmpty|toLooseEqual|toBeRejected|toBeRejectedWith|toHaveBeenOnlyCalledWith|toMatchSchema|toBeBetween|toBeAnInteger|toBeASafeInteger)\(/,
    'earl-only validator',
  ],
  [/\bexpect\.(a|subset|includes)\(/, 'earl-only asymmetric matcher'],
  [
    /this\.timeout\(/,
    'mocha timeout - use it(name, fn, timeout) or a testTimeout config',
  ],
  [/^\s*(before|after)\(/, 'mocha hook - use beforeAll/afterAll'],
]
