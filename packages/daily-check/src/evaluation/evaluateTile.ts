import type { ElasticSearchClient } from '../clients/ElasticSearchClient'
import type { Tile, TinymathNode } from '../dashboard/types'
import { classify } from './classify'
import { formatValue } from './formatValue'
import { evaluateBreakdown, evaluateMetricColumn } from './queryMetric'
import type { TileResult } from './types'

export async function evaluateTile(
  es: ElasticSearchClient,
  tile: Tile,
): Promise<TileResult> {
  if (tile.breakdown) {
    return await evaluateBreakdown(es, tile)
  }
  const value = await evaluateColumn(es, tile, tile.metricColumnId, new Set())
  if (!Number.isFinite(value)) {
    return { tile, value, status: 'none', formatted: 'no data' }
  }
  return {
    tile,
    value,
    status: classify(value, tile.palette),
    formatted: formatValue(value, tile.columns[tile.metricColumnId]),
  }
}

async function evaluateColumn(
  es: ElasticSearchClient,
  tile: Tile,
  columnId: string,
  visiting: Set<string>,
): Promise<number> {
  if (visiting.has(columnId)) {
    throw new Error(`circular column reference "${columnId}"`)
  }
  visiting.add(columnId)

  const column = tile.columns[columnId]
  if (!column) {
    throw new Error(`column "${columnId}" not found`)
  }

  switch (column.operationType) {
    case 'now':
      return Date.now()
    case 'formula': {
      const reference = column.references?.[0]
      if (!reference) {
        throw new Error('formula column has no reference')
      }
      return await evaluateColumn(es, tile, reference, visiting)
    }
    case 'math': {
      const ast = column.params?.tinymathAst
      if (ast === undefined) {
        throw new Error('math column has no tinymath AST')
      }
      return await evaluateAst(es, tile, ast, visiting)
    }
    default:
      return await evaluateMetricColumn(es, tile, column)
  }
}

async function evaluateAst(
  es: ElasticSearchClient,
  tile: Tile,
  node: TinymathNode,
  visiting: Set<string>,
): Promise<number> {
  if (typeof node === 'number') {
    return node
  }
  if (typeof node === 'string') {
    return await evaluateColumn(es, tile, node, new Set(visiting))
  }
  if (node.type === 'variable') {
    return await evaluateColumn(es, tile, node.value, new Set(visiting))
  }

  const args: number[] = []
  for (const arg of node.args) {
    args.push(await evaluateAst(es, tile, arg, visiting))
  }
  const arg = (index: number): number => {
    const value = args[index]
    if (value === undefined) {
      throw new Error(`formula function "${node.name}" is missing an argument`)
    }
    return value
  }
  switch (node.name) {
    case 'add':
      return args.reduce((a, b) => a + b, 0)
    case 'subtract':
      return arg(0) - arg(1)
    case 'multiply':
      return args.reduce((a, b) => a * b, 1)
    case 'divide':
      return arg(0) / arg(1)
    case 'abs':
      return Math.abs(arg(0))
    case 'round': {
      const factor = 10 ** (args[1] ?? 0)
      return Math.round(arg(0) * factor) / factor
    }
    case 'floor':
      return Math.floor(arg(0))
    case 'ceil':
      return Math.ceil(arg(0))
    case 'min':
      return Math.min(...args)
    case 'max':
      return Math.max(...args)
    default:
      throw new Error(`unsupported formula function "${node.name}"`)
  }
}
