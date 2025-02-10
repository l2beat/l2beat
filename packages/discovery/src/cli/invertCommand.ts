import { Logger } from '@l2beat/backend-tools'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { runInversion } from '../inversion/runInversion'

import { join } from 'path'
import { boolean, command, flag, positional, string } from 'cmd-ts'
import { ChainValue } from './types'

export const InvertCommand = command({
  name: 'invert',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    chain: positional({ type: ChainValue, displayName: 'chain' }),
    useMermaidMarkup: flag({ type: boolean, long: 'use-mermaid', short: 'm' }),
  },
  handler: async ({ project, useMermaidMarkup, chain }) => {
    const logger = Logger.DEBUG.for('Inversion')
    logger.info('Starting')

    const configReader = new ConfigReader(join(process.cwd(), '../config'))
    await runInversion(project, configReader, useMermaidMarkup, chain)
  },
})
