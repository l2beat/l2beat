import { Layer2Provider, Layer3Provider } from '@l2beat/config'

import { needsToBe } from './common'

export interface CompareAllCommand {
  type: 'all'
  stack: Layer2Provider | Layer3Provider
  forceTable: boolean
}

export interface FindSimilarCommand {
  type: 'similar'
  projectPath: string
  forceTable: boolean
}

export interface CompareProjectsCommand {
  type: 'project'
  firstProjectPath: string
  secondProjectPath: string
  forceTable: boolean
}

export interface HelpCommand {
  type: 'help'
}

export type Command =
  | CompareAllCommand
  | FindSimilarCommand
  | CompareProjectsCommand
  | HelpCommand

const SUPPORTED_STACKS: {
  stack: Layer2Provider | Layer3Provider
  slug: string
}[] = [
  { stack: 'Arbitrum', slug: 'arbitrum' },
  { stack: 'Loopring', slug: 'loopring' },
  { stack: 'OP Stack', slug: 'opstack' },
  { stack: 'OVM', slug: 'ovm' },
  { stack: 'Polygon', slug: 'polygon' },
  { stack: 'StarkEx', slug: 'starkex' },
  { stack: 'Starknet', slug: 'starknet' },
  { stack: 'ZK Stack', slug: 'zks' },
  { stack: 'zkSync Lite', slug: 'zksync' },
]

export function parseCliParameters(): Command {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { type: 'help' }
  }

  const mode = args.shift()
  if (mode === 'all') {
    const slug = args.shift()
    const stack = SUPPORTED_STACKS.find((x) => x.slug === slug)?.stack
    const suggestion = SUPPORTED_STACKS.map((x) => x.slug).join(', ')
    needsToBe(
      stack !== undefined,
      `You need to provide a valid stack, choose from ${suggestion}`,
    )

    let forceTable = false
    if (args.includes('--force-table')) {
      forceTable = true
    }

    return {
      type: 'all',
      forceTable,
      stack,
    }
  } else if (mode === 'similar') {
    const projectPath = args.shift()
    needsToBe(
      projectPath !== undefined,
      'You need to provide a project path in the format chain:name',
    )

    let forceTable = false
    if (args.includes('--force-table')) {
      forceTable = true
    }

    return {
      type: 'similar',
      forceTable,
      projectPath,
    }
  } else if (mode === 'project') {
    const firstProjectPath = args.shift()
    const secondProjectPath = args.shift()
    needsToBe(
      firstProjectPath !== undefined,
      'You need to provide the first project path in the format chain:name',
    )
    needsToBe(
      secondProjectPath !== undefined,
      'You need to provide the second project path in the format chain:name',
    )

    let forceTable = false
    if (args.includes('--force-table')) {
      forceTable = true
    }

    return {
      type: 'project',
      firstProjectPath,
      secondProjectPath,
      forceTable,
    }
  } else {
    console.log('Invalid mode, expected "project" or "all"')
    return { type: 'help' }
  }
}
