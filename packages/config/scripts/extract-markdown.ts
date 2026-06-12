/**
 * One-off codemod: extracts long-form markdown template literals from
 * src/projects/<slug>/*.ts into sibling .md files and replaces them with
 * readProjectMarkdown() calls.
 *
 * Usage: node -r esbuild-register scripts/extract-markdown.ts [slug...]
 * With no args it processes all projects.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as ts from 'typescript'

const PROJECTS_DIR = join(__dirname, '../src/projects')

const FIELD_ALLOWLIST = new Set([
  'description',
  'detailedDescription',
  'content',
  'riskSummary',
  'proofSystemInfo',
  'upgradesAndGovernance',
  'censorshipResistance',
  'inclusionDelayChartDescription',
])

const NAME_IRRELEVANT_IDENTIFIERS = new Set([
  'formatSeconds',
  'formatLargeNumber',
  'formatBasisPoints',
  'formatExecutionDelay',
  'formatChallengePeriod',
  'formatEther',
  'toString',
  'Number',
  'String',
  'Math',
  'BigInt',
])

main()
function main() {
  const filter = process.argv.slice(2)
  const slugs = readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => filter.length === 0 || filter.includes(slug))

  let extracted = 0
  for (const slug of slugs) {
    const dir = join(PROJECTS_DIR, slug)
    const tsFiles = readdirSync(dir).filter(
      (f) => f.endsWith('.ts') && !f.endsWith('.test.ts'),
    )
    for (const file of tsFiles) {
      extracted += processFile(slug, join(dir, file))
    }
  }
  console.log(`\nDone. Extracted ${extracted} markdown blocks.`)
}

interface Candidate {
  node: ts.NoSubstitutionTemplateLiteral | ts.TemplateExpression
  mdName: string
  content: string
  vars: Record<string, string>
}

function processFile(slug: string, filePath: string): number {
  const source = readFileSync(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
  )

  const candidates: Candidate[] = []
  visit(sourceFile)

  function visit(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      FIELD_ALLOWLIST.has(node.name.text) &&
      (ts.isNoSubstitutionTemplateLiteral(node.initializer) ||
        ts.isTemplateExpression(node.initializer))
    ) {
      const chain = propertyChain(node)
      const parsed = parseTemplate(node.initializer, sourceFile)
      if (parsed && qualifies(parsed.content)) {
        const mdName = deriveName(chain, siblingTitle(node))
        if (mdName) {
          candidates.push({ node: node.initializer, mdName, ...parsed })
        } else {
          console.log(
            `SKIP (no name rule): ${slug} ${chain.join('.')} in ${filePath}`,
          )
        }
      } else if (!parsed) {
        console.log(
          `SKIP (complex interpolation): ${slug} ${chain.join('.')} in ${filePath}`,
        )
      }
    }
    ts.forEachChild(node, visit)
  }

  if (candidates.length === 0) return 0

  const names = candidates.map((c) => c.mdName)
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i)
  if (duplicates.length > 0) {
    console.log(
      `SKIP FILE (duplicate md names ${duplicates.join(', ')}): ${filePath}`,
    )
    return 0
  }

  let result = source
  for (const { node, mdName, content, vars } of [...candidates].reverse()) {
    const mdPath = join(PROJECTS_DIR, slug, `${mdName}.md`)
    if (existsSync(mdPath)) {
      console.log(`SKIP (md exists): ${mdPath}`)
      continue
    }
    writeFileSync(mdPath, `${dedent(content)}\n`)
    const entries = Object.entries(vars)
    const varsArg =
      entries.length === 0
        ? ''
        : `, { ${entries
            .map(([name, expr]) => (name === expr ? name : `${name}: ${expr}`))
            .join(', ')} }`
    result =
      result.slice(0, node.getStart(sourceFile)) +
      `readProjectMarkdown('${slug}', '${mdName}'${varsArg})` +
      result.slice(node.getEnd())
    console.log(`${slug}: ${mdName}.md`)
  }

  if (result !== source) {
    if (!result.includes("from '../../utils/readMarkdown'")) {
      const lastImportEnd = findLastImportEnd(sourceFile)
      result =
        result.slice(0, lastImportEnd) +
        "\nimport { readProjectMarkdown } from '../../utils/readMarkdown'" +
        result.slice(lastImportEnd)
    }
    writeFileSync(filePath, result)
  }
  return candidates.length
}

function qualifies(text: string): boolean {
  return text.trim().length >= 400 || /(^|\n)#{2,3} /.test(text)
}

/**
 * Turns a template literal into md content with {{name}} placeholders and a
 * name -> expression-source map. Returns undefined when a var name cannot be
 * derived unambiguously (handle those by hand).
 */
function parseTemplate(
  node: ts.NoSubstitutionTemplateLiteral | ts.TemplateExpression,
  sourceFile: ts.SourceFile,
): { content: string; vars: Record<string, string> } | undefined {
  if (ts.isNoSubstitutionTemplateLiteral(node)) {
    return { content: node.text, vars: {} }
  }
  let content = node.head.text
  const vars: Record<string, string> = {}
  for (const span of node.templateSpans) {
    const expr = span.expression.getText(sourceFile)
    const name = deriveVarName(span.expression)
    if (!name) return undefined
    // same name must always refer to the same expression
    if (vars[name] !== undefined && vars[name] !== expr) return undefined
    vars[name] = expr
    content += `{{${name}}}${span.literal.text}`
  }
  return { content, vars }
}

/** `${foo}` -> foo, `${a.foo}` -> foo, `${formatSeconds(a.foo)}` -> foo, anything ambiguous -> undefined */
function deriveVarName(expression: ts.Expression): string | undefined {
  if (ts.isIdentifier(expression)) return expression.text
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text
  if (
    ts.isCallExpression(expression) &&
    expression.arguments.length === 1 &&
    ts.isIdentifier(expression.expression) &&
    NAME_IRRELEVANT_IDENTIFIERS.has(expression.expression.text)
  ) {
    return deriveVarName(expression.arguments[0])
  }
  const identifiers = new Set<string>()
  function walk(node: ts.Node) {
    if (ts.isIdentifier(node)) identifiers.add(node.text)
    ts.forEachChild(node, walk)
  }
  walk(expression)
  const relevant = [...identifiers].filter(
    (id) => !NAME_IRRELEVANT_IDENTIFIERS.has(id),
  )
  if (relevant.length === 1) return relevant[0]
  return undefined
}

/** Property names (and array indices) from the project object root to this assignment. */
function propertyChain(node: ts.PropertyAssignment): string[] {
  const chain: string[] = []
  let current: ts.Node = node
  while (current && !ts.isSourceFile(current)) {
    if (ts.isPropertyAssignment(current) && ts.isIdentifier(current.name)) {
      chain.unshift(current.name.text)
    }
    if (
      ts.isArrayLiteralExpression(current.parent) &&
      current.parent.elements.length > 1
    ) {
      const index = current.parent.elements.indexOf(current as ts.Expression)
      if (index >= 0) chain.unshift(String(index + 1))
    }
    current = current.parent
  }
  return chain
}

function deriveName(
  chain: string[],
  title: string | undefined,
): string | undefined {
  const last = chain[chain.length - 1]

  // display.description stays inline (one-sentence, edited with metadata)
  if (last === 'description' && chain[chain.length - 2] === 'display') {
    return undefined
  }
  if (chain.includes('milestones') || chain.includes('risks')) {
    return undefined
  }

  if (last === 'detailedDescription') return 'detailedDescription'
  if (last === 'riskSummary') return 'riskSummary'
  if (last === 'censorshipResistance') return 'censorshipResistance'
  if (last === 'proofSystemInfo') return 'proofSystemInfo'
  if (last === 'inclusionDelayChartDescription') {
    return 'inclusionDelayChartDescription'
  }
  if (
    last === 'upgradesAndGovernance' ||
    (last === 'content' && chain[chain.length - 2] === 'upgradesAndGovernance')
  ) {
    return 'upgradesAndGovernance'
  }

  if (last === 'description' && chain[chain.length - 2] === 'technology') {
    const owner = chain[chain.length - 3]
    if (owner === 'daLayer') return 'daLayerTechnology'
    if (owner === 'daBridge') return 'daBridgeTechnology'
    if (owner === 'customDa') return 'customDaTechnology'
    return 'technology'
  }
  if (
    last === 'description' &&
    chain[chain.length - 2] === 'consensusAlgorithm' &&
    chain[chain.length - 3] === 'daLayer'
  ) {
    return 'daLayerConsensusAlgorithm'
  }
  if (
    last === 'description' &&
    chain[chain.length - 3] === 'stateValidation' &&
    chain[chain.length - 2] === 'categories' &&
    title
  ) {
    return `stateValidation${pascal(title)}`
  }
  // technology choice: technology.<choice>.description, possibly with array index
  if (last === 'description') {
    const technologyAt = chain.findIndex(
      (p) => p === 'technology' || p === 'nonTemplateTechnology',
    )
    if (technologyAt !== -1) {
      const middle = chain.slice(technologyAt + 1, -1)
      if (middle.length > 0) return `technology${middle.map(pascal).join('')}`
    }
  }
  return undefined
}

/** Value of a sibling `title: '...'` property in the same object literal. */
function siblingTitle(node: ts.PropertyAssignment): string | undefined {
  const parent = node.parent
  if (!ts.isObjectLiteralExpression(parent)) return undefined
  for (const prop of parent.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      ts.isIdentifier(prop.name) &&
      prop.name.text === 'title' &&
      ts.isStringLiteral(prop.initializer)
    ) {
      return prop.initializer.text
    }
  }
  return undefined
}

function pascal(value: string): string {
  return value
    .split(/[\s\-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Trims the text and removes the common leading indentation that template
 * literals carry over from the source file, keeping relative nesting.
 */
function dedent(text: string): string {
  const lines = text.trim().split('\n')
  const indents = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((l) => l.length - l.trimStart().length)
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0
  const body = lines.slice(1).map((l) => (l.trim() ? l.slice(minIndent) : ''))
  return [lines[0], ...body].join('\n')
}

function findLastImportEnd(sourceFile: ts.SourceFile): number {
  let end = 0
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) end = statement.getEnd()
  }
  return end
}
