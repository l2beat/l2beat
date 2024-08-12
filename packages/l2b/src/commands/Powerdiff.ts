import { Type, command, option, positional, string } from 'cmd-ts'
import {
  DIFFING_MODES,
  DISPLAY_MODES,
  DiffingMode,
  DisplayMode,
  powerdiff,
} from '../implementations/powerdiff'
import { Directory } from './types'

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

export const Powerdiff = command({
  name: 'powerdiff',
  description:
    'Compare two directories recursively using difftastic and serve the result',
  version: '1.0.0',
  args: {
    leftPath: positional({ type: Directory, displayName: 'leftPath' }),
    rightPath: positional({ type: Directory, displayName: 'rightPath' }),
    difftasticPath: option({
      type: string,
      long: 'difftastic-path',
      defaultValue: () => 'difft',
    }),
    mode: option({
      type: DiffingModeType,
      description:
        'mode in which diff will be generated, either together or split',
      long: 'mode',
      short: 'm',
      defaultValue: () => 'together' as const,
    }),
    displayMode: option({
      type: DisplayModeType,
      description:
        'mode in which diff will be shown, either inline or side-by-side',
      long: 'display-mode',
      short: 'd',
      defaultValue: () => 'inline' as const,
    }),
  },
  handler: ({ leftPath, rightPath, difftasticPath, mode, displayMode }) => {
    powerdiff(leftPath, rightPath, difftasticPath, mode, displayMode)
  },
})
