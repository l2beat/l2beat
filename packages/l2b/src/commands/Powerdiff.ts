import { Type, command, option, positional, string, subcommands } from 'cmd-ts'
import {
  DIFFING_MODES,
  DISPLAY_MODES,
  DiffingMode,
  DisplayMode,
  powerdiff,
} from '../implementations/powerdiff'
import { Directory } from './types'
import { readConfig } from '../config/readConfig'
import { assert } from '@l2beat/shared-pure'
import path from 'path'
import { readdirSync } from 'fs'

export const DiffingModeType: Type<string, DiffingMode> = {
  async from(str): Promise<DiffingMode> {
    return new Promise((resolve, reject) => {
      if (!DIFFING_MODES.includes(str as DiffingMode)) {
        reject(new Error(`Diffing modes are: ${DIFFING_MODES.join(', ')}`))
      }
      resolve(str as DiffingMode)
    })
  },
}

export const DisplayModeType: Type<string, DisplayMode> = {
  async from(str): Promise<DisplayMode> {
    return new Promise((resolve, reject) => {
      if (!DISPLAY_MODES.includes(str as DisplayMode)) {
        reject(new Error(`Display modes are: ${DISPLAY_MODES.join(', ')}`))
      }
      resolve(str as DisplayMode)
    })
  },
}

const difftasticPath = option({
  type: string,
  long: 'difftastic-path',
  defaultValue: () => 'difft',
})

const mode = option({
  type: DiffingModeType,
  description: 'mode in which diff will be generated, either together or split',
  long: 'mode',
  short: 'm',
  defaultValue: () => 'together' as const,
})

const displayMode = option({
  type: DisplayModeType,
  description:
    'mode in which diff will be shown, either inline or side-by-side',
  long: 'display-mode',
  short: 'd',
  defaultValue: () => 'inline' as const,
})

export const PowerdiffPath = command({
  name: 'path',
  description:
    'Compare two directories recursively using difftastic and serve the result',
  args: {
    leftPath: positional({ type: Directory, displayName: 'leftPath' }),
    rightPath: positional({ type: Directory, displayName: 'rightPath' }),
    difftasticPath,
    mode,
    displayMode,
  },
  handler: ({ leftPath, rightPath, difftasticPath, mode, displayMode }) => {
    powerdiff(leftPath, rightPath, difftasticPath, mode, displayMode)
  },
})

export const PowerdiffDiscovery = command({
  name: 'discovery',
  description:
    'Compare two directories recursively using difftastic and serve the result',
  args: {
    chain: positional({ type: string, displayName: 'chain' }),
    project: positional({ type: string, displayName: 'project' }),
    difftasticPath,
    mode,
    displayMode,
  },
  handler: ({ chain, project, difftasticPath, mode, displayMode }) => {
    const config = readConfig()
    assert(
      config.discoveryPath !== undefined,
      'Discovery path is not set in the configuration file, set it in .l2b',
    )
    const projectPath = path.join(config.discoveryPath, project, chain)
    const contents = readdirSync(projectPath)

    const flatAt = contents.filter((f) => f.startsWith('.flat@'))
    const hasFlat = contents.includes('.flat')
    assert(
      flatAt.length <= 1,
      'Multiple .flat@<number> found, expected only a single one, rerun discovery.',
    )
    assert(
      hasFlat && flatAt.length === 1,
      'Missing .flat or .flat@<number>, rerun discovery.',
    )

    const leftPath = path.join(projectPath, '.flat')
    const rightPath = path.join(projectPath, flatAt[0])
    powerdiff(leftPath, rightPath, difftasticPath, mode, displayMode)
  },
})

export const Powerdiff = subcommands({
  name: 'powerdiff',
  description: 'Compare project similarities based on flat sources',
  cmds: {
    path: PowerdiffPath,
    discovery: PowerdiffDiscovery,
  },
})
