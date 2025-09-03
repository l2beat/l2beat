import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import {
  command,
  number,
  option,
  positional,
  string,
  subcommands,
  type Type,
} from 'cmd-ts'
import { readdirSync } from 'fs'
import path from 'path'
import {
  DIFFING_MODES,
  DISPLAY_MODES,
  type DiffingMode,
  type DisplayMode,
  powerdiff,
} from '../implementations/powerdiff'
import { Directory } from './types'

export const DiffingModeType: Type<string, DiffingMode> = {
  from(str): Promise<DiffingMode> {
    return new Promise((resolve, reject) => {
      if (!DIFFING_MODES.includes(str as DiffingMode)) {
        reject(new Error(`Diffing modes are: ${DIFFING_MODES.join(', ')}`))
      }
      resolve(str as DiffingMode)
    })
  },
}

export const DisplayModeType: Type<string, DisplayMode> = {
  from(str): Promise<DisplayMode> {
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
  description:
    'mode in which diff will be generated, either together or split.',
  long: 'mode',
  short: 'm',
  defaultValue: () => 'together' as const,
})

const displayMode = option({
  type: DisplayModeType,
  description:
    'mode in which diff will be shown, either inline or side-by-side.',
  long: 'display-mode',
  short: 'd',
  defaultValue: () => 'inline' as const,
})

export const diffContext = option({
  type: number,
  description: 'number of additional lines to show around the difference.',
  long: 'context',
  short: 'c',
  defaultValue: () => 3,
  defaultValueIsSerializable: true,
})

const PowerdiffPath = command({
  name: 'path',
  description:
    'Compare two directories recursively using difftastic and serve the result.',
  args: {
    leftPath: positional({ type: Directory, displayName: 'leftPath' }),
    rightPath: positional({ type: Directory, displayName: 'rightPath' }),
    difftasticPath,
    mode,
    displayMode,
    diffContext,
  },
  handler: ({
    leftPath,
    rightPath,
    difftasticPath,
    mode,
    displayMode,
    diffContext,
  }) => {
    powerdiff(
      leftPath,
      rightPath,
      difftasticPath,
      mode,
      displayMode,
      diffContext,
    )
  },
})

const PowerdiffDiscovery = command({
  name: 'discovery',
  description:
    'Compare two directories recursively using difftastic and serve the result.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    difftasticPath,
    mode,
    displayMode,
    diffContext,
  },
  handler: ({ project, difftasticPath, mode, displayMode, diffContext }) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const projectPath = configReader.getProjectPath(project)
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

    const leftPath = path.join(projectPath, flatAt[0])
    const rightPath = path.join(projectPath, '.flat')
    powerdiff(
      leftPath,
      rightPath,
      difftasticPath,
      mode,
      displayMode,
      diffContext,
    )
  },
})

export const Powerdiff = subcommands({
  name: 'powerdiff',
  description: 'Compare project similarities based on flat sources.',
  cmds: {
    path: PowerdiffPath,
    discovery: PowerdiffDiscovery,
  },
})
