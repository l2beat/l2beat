import type { ContractFieldSeverity } from '../config/StructureConfig'
import type { DiscoveryDiff } from './diffDiscovery'

export interface DiffHistoryBlock {
  addressType: DiscoveryDiff['addressType']
  name?: string
  address: string
  template?: string
  description?: string
  type?: DiscoveryDiff['type']
  diff?: DiffHistoryFieldChange[]
}

export interface DiffHistoryFieldChange {
  key: string
  before?: string
  after?: string
  severity?: ContractFieldSeverity
  description?: string
}

const KINDS: { label: string; addressType: DiscoveryDiff['addressType'] }[] = [
  { label: 'external contract', addressType: 'Reference' },
  { label: 'contract', addressType: 'Contract' },
  { label: 'EOA', addressType: 'EOA' },
  { label: 'reference', addressType: 'Reference' },
]

export function parseDiffHistoryBlocks(body: string): DiffHistoryBlock[] {
  const lines = body.split('\n')
  const blocks: DiffHistoryBlock[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== '```diff') continue
    let end = i + 1
    while (end < lines.length && lines[end] !== '```') end++
    blocks.push(parseBlock(lines.slice(i + 1, end)))
    i = end
  }
  return blocks
}

function parseBlock(lines: string[]): DiffHistoryBlock {
  let i = 0
  const type =
    lines[0] === '+   Status: CREATED'
      ? 'created'
      : lines[0] === '-   Status: DELETED'
        ? 'deleted'
        : undefined
  if (type !== undefined) i++
  const header = parseHeaderLine(lines[i] ?? '')
  if (header === undefined)
    throw new Error(`Bad diff block header: ${lines[i]}`)
  i++

  const block: DiffHistoryBlock = { ...header.block }
  if (type !== undefined) block.type = type
  if (header.hasFields) block.diff = []
  let severity: ContractFieldSeverity | undefined
  let description: string | undefined
  let field: DiffHistoryFieldChange | undefined
  let append = (_line: string) => {}
  const join = (text: string | undefined, line: string) =>
    text === undefined ? line : `${text}\n${line}`

  for (; i < lines.length; i++) {
    const line = lines[i] ?? ''
    if (line === '    }') break
    if (line.startsWith('    +++ description: ')) {
      const text = line.slice('    +++ description: '.length)
      if (text !== 'None') block.description = text
      append = (more) => (block.description = join(block.description, more))
    } else if (line.startsWith('+++ severity: ')) {
      severity = line.slice('+++ severity: '.length) as ContractFieldSeverity
    } else if (line.startsWith('+++ description: ')) {
      description = line.slice('+++ description: '.length)
      append = (more) => (description = join(description, more))
    } else if (line.startsWith('+++ ')) {
    } else if (
      line.startsWith('      ') &&
      !line.startsWith('       ') &&
      line.endsWith(':')
    ) {
      field = { key: line.slice(6, -1) }
      if (severity !== undefined) field.severity = severity
      if (description !== undefined) field.description = description
      block.diff?.push(field)
      severity = description = undefined
    } else if (line.startsWith('-        ') && field !== undefined) {
      const current = field
      current.before = line.slice(9)
      append = (more) => (current.before = join(current.before, more))
    } else if (line.startsWith('+        ') && field !== undefined) {
      const current = field
      current.after = line.slice(9)
      append = (more) => (current.after = join(current.after, more))
    } else if (line.trim() !== '') {
      append(line)
    }
  }
  return block
}

function parseHeaderLine(line: string) {
  if (!line.startsWith('    ')) return undefined
  let rest = line.slice(4)
  const hasFields = rest.endsWith(' {')
  if (hasFields) rest = rest.slice(0, -2)

  let template: string | undefined
  if (rest.endsWith(']')) {
    const open = rest.lastIndexOf(' [')
    if (open === -1) return undefined
    template = rest.slice(open + 2, -1)
    rest = rest.slice(0, open)
    if (template === 'N/A') template = undefined
  }

  const open = rest.lastIndexOf('(')
  if (open === -1 || !rest.endsWith(')')) return undefined
  const address = rest.slice(open + 1, -1)
  if (address === '' || address.includes(' ')) return undefined
  const kindAndName = rest.slice(0, open).trimEnd()
  const kind = KINDS.find(
    (k) => kindAndName === k.label || kindAndName.startsWith(`${k.label} `),
  )
  if (kind === undefined) return undefined
  const name = kindAndName.slice(kind.label.length).trim()

  const block: DiffHistoryBlock = { addressType: kind.addressType, address }
  if (name !== '') block.name = name
  if (template !== undefined) block.template = template
  return { block, hasFields }
}
