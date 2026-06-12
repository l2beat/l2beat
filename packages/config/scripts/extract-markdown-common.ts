/**
 * One-off: extracts long-form markdown from common/ and shared module
 * constants into .md files. Companion to extract-markdown.ts.
 *
 * Usage: node -r esbuild-register scripts/extract-markdown-common.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import * as ts from 'typescript'

const SRC = join(__dirname, '../src')

interface Replacement {
  start: number
  end: number
  call: string
  mdPath: string
  content: string
}

main()
function main() {
  extractTrustedSetups()
  extractEspresso()
  extractConst(
    'projects/relay/relay.ts',
    'RELAY_DETAILED_DESCRIPTION',
    'projects/relay/detailedDescription.md',
    "readProjectMarkdown('relay', 'detailedDescription'",
    "import { readProjectMarkdown } from '../../utils/readMarkdown'",
  )
  extractConst(
    'projects/wormhole/shared.ts',
    'WORMHOLE_DETAILED_DESCRIPTION',
    'projects/wormhole/detailedDescription.md',
    "readProjectMarkdown('wormhole', 'detailedDescription'",
    "import { readProjectMarkdown } from '../../utils/readMarkdown'",
  )
  extractConst(
    'projects/shared-circle/shared.ts',
    'CCTP_DETAILED_DESCRIPTION',
    'projects/shared-circle/cctpDetailedDescription.md',
    "readProjectMarkdown('shared-circle', 'cctpDetailedDescription'",
    "import { readProjectMarkdown } from '../../utils/readMarkdown'",
  )
  extractConst(
    'projects/shared-circle/shared.ts',
    'CIRCLE_GATEWAY_DETAILED_DESCRIPTION',
    'projects/shared-circle/circleGatewayDetailedDescription.md',
    "readProjectMarkdown('shared-circle', 'circleGatewayDetailedDescription'",
    "import { readProjectMarkdown } from '../../utils/readMarkdown'",
  )
}

/** TRUSTED_SETUPS.<Key>.longDescription -> common/trustedSetups/<Key>.md */
function extractTrustedSetups() {
  const file = 'common/zkCatalogTrustedSetups.ts'
  const { sourceFile, source } = parse(file)
  const replacements: Replacement[] = []

  function visit(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'longDescription' &&
      (ts.isNoSubstitutionTemplateLiteral(node.initializer) ||
        ts.isTemplateExpression(node.initializer))
    ) {
      const entry = node.parent
      const keyProp = entry.parent
      if (!ts.isPropertyAssignment(keyProp)) return
      const key = keyProp.name.getText(sourceFile)
      const parsed = parseTemplate(node.initializer, sourceFile)
      if (!parsed) {
        console.log(`SKIP (complex interpolation): ${file} ${key}`)
        return
      }
      if (dedent(parsed.content).split('\n').length < 5) {
        console.log(`SKIP (short): ${file} ${key}`)
        return
      }
      replacements.push({
        start: node.initializer.getStart(sourceFile),
        end: node.initializer.getEnd(),
        call: buildCall(
          `readMarkdown('common/trustedSetups/${key}.md'`,
          parsed.vars,
        ),
        mdPath: join(SRC, `common/trustedSetups/${key}.md`),
        content: parsed.content,
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  apply(
    file,
    source,
    replacements,
    "import { readMarkdown } from '../utils/readMarkdown'",
    sourceFile,
  )
}

/** common/sequencing.ts ESPRESSO.description -> common/sequencing/espresso.md */
function extractEspresso() {
  const file = 'common/sequencing.ts'
  const { sourceFile, source } = parse(file)
  const replacements: Replacement[] = []

  function visit(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'description' &&
      (ts.isNoSubstitutionTemplateLiteral(node.initializer) ||
        ts.isTemplateExpression(node.initializer))
    ) {
      const parsed = parseTemplate(node.initializer, sourceFile)
      if (!parsed || dedent(parsed.content).split('\n').length < 5) return
      replacements.push({
        start: node.initializer.getStart(sourceFile),
        end: node.initializer.getEnd(),
        call: buildCall(
          `readMarkdown('common/sequencing/espresso.md'`,
          parsed.vars,
        ),
        mdPath: join(SRC, 'common/sequencing/espresso.md'),
        content: parsed.content,
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  apply(
    file,
    source,
    replacements,
    "import { readMarkdown } from '../utils/readMarkdown'",
    sourceFile,
  )
}

/** module-level `const <name> = \`...\`` -> md file */
function extractConst(
  file: string,
  constName: string,
  mdRelPath: string,
  callPrefix: string,
  importLine: string,
) {
  const { sourceFile, source } = parse(file)
  const replacements: Replacement[] = []

  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === constName &&
      node.initializer &&
      (ts.isNoSubstitutionTemplateLiteral(node.initializer) ||
        ts.isTemplateExpression(node.initializer))
    ) {
      const parsed = parseTemplate(node.initializer, sourceFile)
      if (!parsed) {
        console.log(`SKIP (complex interpolation): ${file} ${constName}`)
        return
      }
      replacements.push({
        start: node.initializer.getStart(sourceFile),
        end: node.initializer.getEnd(),
        call: buildCall(callPrefix, parsed.vars),
        mdPath: join(SRC, mdRelPath),
        content: parsed.content,
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  apply(file, source, replacements, importLine, sourceFile)
}

function parse(file: string) {
  const fullPath = join(SRC, file)
  const source = readFileSync(fullPath, 'utf8')
  const sourceFile = ts.createSourceFile(
    fullPath,
    source,
    ts.ScriptTarget.Latest,
    true,
  )
  return { sourceFile, source }
}

function buildCall(prefix: string, vars: Record<string, string>): string {
  const entries = Object.entries(vars)
  const varsArg =
    entries.length === 0
      ? ''
      : `, { ${entries
          .map(([name, expr]) => (name === expr ? name : `${name}: ${expr}`))
          .join(', ')} }`
  return `${prefix}${varsArg})`
}

function apply(
  file: string,
  source: string,
  replacements: Replacement[],
  importLine: string,
  sourceFile: ts.SourceFile,
) {
  if (replacements.length === 0) return
  let result = source
  for (const r of [...replacements].sort((a, b) => b.start - a.start)) {
    mkdirSync(dirname(r.mdPath), { recursive: true })
    writeFileSync(r.mdPath, `${dedent(r.content)}\n`)
    result = result.slice(0, r.start) + r.call + result.slice(r.end)
    console.log(`${file}: ${r.mdPath.replace(`${SRC}/`, '')}`)
  }
  const importSource = importLine.match(/from '(.*)'/)?.[1] ?? ''
  if (!result.includes(`from '${importSource}'`)) {
    let end = 0
    for (const statement of sourceFile.statements) {
      if (ts.isImportDeclaration(statement)) end = statement.getEnd()
    }
    result =
      end === 0
        ? `${importLine}\n${result}`
        : `${result.slice(0, end)}\n${importLine}${result.slice(end)}`
  }
  writeFileSync(join(SRC, file), result)
}

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
    const name = ts.isIdentifier(span.expression)
      ? span.expression.text
      : undefined
    if (!name) return undefined
    if (vars[name] !== undefined && vars[name] !== expr) return undefined
    vars[name] = expr
    content += `{{${name}}}${span.literal.text}`
  }
  return { content, vars }
}

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
